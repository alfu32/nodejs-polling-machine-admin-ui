import React, {useEffect} from 'react';
import {useFetch} from "use-http";
import {useEditors} from "../hooks/editors";
import './sidebar.css'
import {XsButton} from "./framework/xs-button";
import {CrudList} from "./framework/crud-list";
import {ModuleList} from './module-list';
import {config} from '../../package.json';
import Editor from "@monaco-editor/react";


function expandItem(title,items,item){
  console.log(title,'editItem',item);
}
function editItem(title,items,item){
  console.log(title,'editItem',item);
}
function createRelatedItem(title,items,item){
  console.log(title,'createRelatedItem',item);
}
function copyItem(title,items,item){
  console.log(title,'copyItem',item);
}
function deleteItem(title,items,item){
  console.log(title,'deleteItem',item);
}

export function Sidebar({onItemClick}){
  const modules = useFetch(`${config.apiBaseUrl}/Module/getAll`, {method:'GET'}, [])
  const watchers = useFetch(`${config.apiBaseUrl}/Watcher/getAll`, {method:'GET'}, [])
  function editItem(item) {
      console.log('sidebar.launch.edit-item',item)
      onItemClick(item);
  }
  function createHandler(){}
  function copyObserver(){}
  function deleteObserver(){}
  function handleModuleUpdate(){}
  function handleWatcherUpdate(){}
  return (<>
    <CrudList
      title="Modules"
      itemName={it => `MODULE-${it.npm_module}`}
      items={{...modules,data:(modules&&modules.data?modules.data:[]).map(m=>{
          return {
          ...m,
          form:(<>
          Module Id : {m.module_id}<br/>
          NpmModule:<input type="text" defaultValue={m.npm_module}/><br/>
          Code:<br/>
          <Editor
            height="30vh"
            theme="vs-dark"
            defaultLanguage="javascript"
            defaultValue={m.source}
            onChange={handleModuleUpdate('code',m)}
          /></>),
          type:'module',
          name:m.npm_module,
      } })}}
      onExpand={false}
      onEdit={(title,items,item) => {
          editItem(item)
      }}
      onCreateRelated={false}
      onCopy={false}
      onDelete={(title,items,item) => {}}
      />
    <CrudList
      title="Watchers"
      itemName={it => `WATCH-${it.name}`}
      items={{...watchers,data:(watchers&&watchers.data?watchers.data:[]).map(w=>{ return {
          ...w,
          form:(<>
          Module Id : {w.watcher_id}<br/>
          NpmModule:<input type="text" defaultValue={w.name}/><br/>
          Code:<br/>
              <Editor
            height="40vh"
            theme="vs-dark"
            defaultLanguage="javascript"
            defaultValue={w.source}
            onChange={handleWatcherUpdate('watcher',w)}
          />
          Poll Config:<br/>
              <Editor
            height="20vh"
            theme="vs-dark"
            defaultLanguage="json"
            defaultValue={w.poll_config}
            onChange={handleWatcherUpdate('watcher',w)}
          />
          </>),
          type:'watcher',
          name:w.name,
      } })}}
      onExpand={(title,items,item) => {expandItem(title,items,item)}}
      onEdit={(title,items,item) => {
          editItem(item)
      }}
      onCreateRelated={(title,items,item) => {}}
      onCopy={(title,items,item) => {}}
      onDelete={(title,items,item) => {}}/>
  </>)
}