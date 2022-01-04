import React, { useState, useEffect } from "react";
import { Router, Link } from "wouter";
import {useFetch} from 'use-http';
import {log} from "./service/logger";
import {config} from '../package.json';
import {subscribe} from './service/logger'

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons

import { Splitter, SplitterPanel } from 'primereact/splitter';
import {useEditors} from "./hooks/editors";
import {Editors} from "./components/editors";
import {Sidebar} from "./components/sidebar";
import Editor from "@monaco-editor/react";
import { Button } from 'primereact/button';
import {useModules,useWatchers} from './hooks/api.hooks';
import {XsButton} from "./components/framework/xs-button";
import {CrudList} from "./components/framework/crud-list";

/**
* This code defines the react app
*
* Imports the router functionality to provide page navigation
* Defines the Home function outlining the content on each page
* Content specific to each page (Home and About) is defined in their components in /pages
* Each page content is presented inside the overall structure defined here
* The router attaches the page components to their paths
*/

// Import and apply CSS stylesheet
import "./styles/styles.css";

// Where all of our pages come from
//import PageRouter from "./components/router.jsx";
//import useHashLocation from "./hooks/wouter-hash";

// The component that adds our Meta tags to the page
//import Seo from './components/seo.jsx';

// Home function that is reflected across the site
export default function App() {
  const [loadingModules, errorModules,modules,addModule,updateModule,deleteModule] = useModules();
  const [loadingWatchers, errorWatchers,watchers,addWatcher,updateWatcher,deleteWatcher] = useWatchers();
  console.log({
    loadingModules,
    loadingWatchers,
    modules,
    watchers,
  })
  /// const modules = useFetch(`${config.apiBaseUrl}/Modules`, {method:'GET'}, []);
  /// const watchers = useFetch(`${config.apiBaseUrl}/Watchers`, {method:'GET'}, []);
  /// console.log({modules,watchers});
  
  const [editors,addEditor,removeEditor,updateEditor] = useEditors([]);
  const [hlog,setHlog] = useState([]);
  subscribe(({method,prefix,args})=>{
    setHlog([...hlog,{prefix}]);
  })
  useEffect(()=>{
    // setHlog([...hlog])
  },[hlog])
  async function saveAction(editor){
    const newItem=Object.keys(editor.changes)
    .reduce((item,key) => {
      item[key]=editor.changes[key].newValue
      return item;
    },{...editor.item})
    console.log({editor,newItem});
    try{
      await editor.api.update(newItem);
      delete editor.changes;
      editor.item=newItem;
      updateEditor(editor);
    }catch(err){
      console.error('error saving',{editor,newItem});
    }
  }
  function handleUpdate(tag,code,wrapper,item){
    return function(newValue,changes){
      wrapper.changes=wrapper.changes||{};
      wrapper.changes[code]={
        changes,newValue
      }
      // console.log(tag,code,wrapper,item,newValue,changes);
      console.log('changed',wrapper);
      updateEditor(wrapper);
    }
  }
  function handleInputUpdate(tag,code,wrapper,item){
    return function(ev){
      const newValue=ev.target.value;
      const changes=[wrapper.item[code],newValue]
      wrapper.changes=wrapper.changes||{};
      wrapper.changes[code]={
        changes,newValue
      }
      // console.log(tag,code,wrapper,item,newValue,changes);
      console.log('changed',wrapper);
      updateEditor(wrapper);
    }
  }
  const _modules = {
    loading:loadingModules,
    data:(loadingModules?[]:(modules||[]))
    .map(m=>{
      const wrapper = {
        item:m,
        id:`module/${m.name}`,
        type:'module',
        name:m.npm_module,
        api:{
          add:addModule,
          update:updateModule,
          delete:deleteModule,
        },
      };
      const form = (<>
        Module Id : {m.module_id}<br/>
        InjectionReference:<input type="text" defaultValue={m.injection_ref_name} onChange={handleInputUpdate('module','injection_ref_name',wrapper)}/><br/>
        NpmModule:<input type="text" defaultValue={m.npm_module} onChange={handleInputUpdate('module','npm_module',wrapper)}/><br/>
        {m.npm_module&&m.npm_module!=""
         ?(<>Code:<br/>
          <Editor
            height="30vh"
            theme="vs-dark"
            defaultLanguage="javascript"
            defaultValue={m.source}
            onChange={handleUpdate('module','source',wrapper)}
          /></>)
         :[]
        }
        </>);
      wrapper.form = form;
      return wrapper;
    })}
  const _watchers = {
    loading:loadingWatchers,
    data:(loadingWatchers?[]:(watchers||[]))
      .map(w=>{
        const wrapper = {
          item:w,
          id:`module/${w.name}`,
          type:'watcher',
          name:w.name,
          api:{
            add:addWatcher,
            update:updateWatcher,
            delete:deleteWatcher,
          },
        };
        const form = (<>
          Watcher Id : {w.watcher_id}<br/>
          Name : <input type="text" defaultValue={w.name} onChange={handleInputUpdate('watcher','name',wrapper)}/><br/>
          Code:<br/>
              <Editor
            height="40vh"
            theme="vs-dark"
            defaultLanguage="javascript"
            defaultValue={w.source}
            onChange={handleUpdate('watcher','source',wrapper)}
          />
          Poll Config:<br/>
              <Editor
            height="20vh"
            theme="vs-dark"
            defaultLanguage="javascript"
            defaultValue={w.poll_config}
            onChange={handleUpdate('watcher','poll_config',wrapper)}
          />
        </>);
        wrapper.form = form
        return wrapper;
      })
  }
  function editItem(item) {
    log('sidebar.launch.edit-item',item);
    console.log('addEditor',item);
    addEditor(item);
  }
  function deleteItem(item) {
    log('sidebar.delete.edit-item',item);
    console.log('delete-item',item);
  }
  const lists = {
      modules:{
        title:'Modules',
        type:'module',
        data:_modules,
        onExpand:false,
        onEdit:(title,items,item)=>{editItem(item)},
        onCreateRelated:false,
        onCopy:false,
        onDelete:(title,items,item)=>{editItem(item)},
      },
      watchers:{
        title:'Watchers',
        type:'watcher',
        data:_watchers,
        onExpand:(title,items,item)=>{},
        onEdit:(title,items,item)=>{editItem(item)},
        onCreateRelated:(title,items,item)=>{},
        onCopy:(title,items,item)=>{},
        onDelete:(title,items,item)=>{deleteItem(item)},
      }
    }
  return (<>
    <Splitter style={{width: '100%'}}>
      <SplitterPanel>
        {Object.values(lists)
        .map(
          list => <CrudList
            key={list.title}
            title={list.title}
            itemName={it => it.name}
            items={list.data}
            onExpand={list.onExpand}
            onEdit={list.onEdit}
            onCreateRelated={list.onCreateRelated}
            onCopy={list.onCopy}
            onDelete={list.onDelete}
            />
        )}
      </SplitterPanel>
      <SplitterPanel>
        <Editors
          editors={editors}
          removeAction={editor => {
            removeEditor(editor)
          }}
          saveAction={saveAction}
        />
      </SplitterPanel>
    </Splitter>
      <pre>{JSON.stringify(hlog,null," ")}</pre>
    </>)
/*  return (
    <Router hook={useHashLocation}>
      <Seo />
      <main role="main" className="wrapper">
        <div className="content">
          
          <PageRouter />
        </div>
      </main>
      
      <footer className="footer">
        <div className="links">
          <Link href="/">Home</Link>
          <span className="divider">|</span>
          <Link href="/about">About</Link>
        </div>
        <a
          className="btn--remix"
          target="_top"
          href="https://glitch.com/edit/#!/remix/glitch-hello-react"
        >
          <img src="https://cdn.glitch.com/605e2a51-d45f-4d87-a285-9410ad350515%2FLogo_Color.svg?v=1618199565140" alt="" />
          Remix on Glitch
        </a>
      </footer>
    </Router>
  );*/
}
