import React, {useEffect} from 'react';
import {useFetch} from "use-http";
import {log} from "../service/logger";
import {useEditors} from "../hooks/editors";
import './sidebar.css'
import {XsButton} from "./framework/xs-button";
import {CrudList} from "./framework/crud-list";
import {ModuleList} from './module-list';
import {config} from '../../package.json';


function expandItem(title,items,item){
  log(title,'editItem',item);
}
function editItem(title,items,item){
  log(title,'editItem',item);
}
function createRelatedItem(title,items,item){
  log(title,'createRelatedItem',item);
}
function copyItem(title,items,item){
  log(title,'copyItem',item);
}
function deleteItem(title,items,item){
  log(title,'deleteItem',item);
}

export function Sidebar({lists,onItemClick}){
  function editItem(item) {
      log('sidebar.launch.edit-item',item)
      onItemClick(item);
  }
  function createHandler(){}
  function copyObserver(){}
  function deleteObserver(){}
  return (<>
      {
        Object.values(lists)
        .map(
          list => <CrudList
      title={list.title}
      itemName={it => `${list.type.toUpperCase()}-${it.npm_module}`}
      items={list.data}
      onExpand={false}
      onEdit={(title,items,item) => {
          editItem(item)
      }}
      onCreateRelated={false}
      onCopy={false}
      onDelete={(title,items,item) => {}}
      />
        )
      }
  </>)
}