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
  const modules = useFetch(`${config.apiBaseUrl}/Module/getAll`, {method:'GET'}, [])
  const watchers = useFetch(`${config.apiBaseUrl}/Watcher/getAll`, {method:'GET'}, [])
  const [editors,addEditor,removeEditor,updateEditor] = useEditors([]);
  const [hlog,setHlog] = useState([]);
  subscribe(({method,prefix,args})=>{
    setHlog([...hlog,{prefix}]);
  })
  useEffect(()=>{
    // setHlog([...hlog])
  },[hlog])
  const onItemChanged=wrapper => {
    console.log('changed',wrapper)
  }
  function fnFactory(key,editor){
    return (value)=>{
      console.log({editor, key, value});
    }
  }
  function handleUpdate(tag,code,wrapper,item){
    return function(newValue,changes){
      wrapper.changes=wrapper.changes||{};
      wrapper.changes[code]={
        changes,newValue
      }
      // console.log(tag,code,wrapper,item,newValue,changes);
      onItemChanged(wrapper);
    }
  }
  const _modules = {
    ...modules,
    data:(modules&&modules.data?modules.data:[])
    .map(m=>{
      const wrapper = {
        ...m,
        id:`module/${m.name}`,
        type:'module',
        name:m.npm_module,
        changes:null,
        newValue:m.source,
      };
      const form = (<>
        Module Id : {m.module_id}<br/>
        NpmModule:<input type="text" defaultValue={m.npm_module}/><br/>
        Code:<br/>
        <Editor
          height="30vh"
          theme="vs-dark"
          defaultLanguage="javascript"
          defaultValue={m.source}
          onChange={handleUpdate('module','source',wrapper,m)}
        /></>);
      wrapper.form = form;
      return wrapper;
    })}
  const _watchers = {
    ...watchers,
    data:(watchers&&watchers.data?watchers.data:[])
      .map(w=>{
        const wrapper = {
          ...w,
          id:`module/${w.name}`,
          type:'watcher',
          name:w.name,
        };
        const form = (<>
          <Button onClick={(ev)=>{
                  log('watchers-save',w);
                }}>Save</Button>
          Watcher Id : {w.watcher_id}<br/>
          Name : <input type="text" defaultValue={w.name}/><br/>
          Code:<br/>
              <Editor
            height="40vh"
            theme="vs-dark"
            defaultLanguage="javascript"
            defaultValue={w.source}
            onChange={handleUpdate('watcher','source',wrapper,w)}
          />
          Poll Config:<br/>
              <Editor
            height="20vh"
            theme="vs-dark"
            defaultLanguage="javascript"
            defaultValue={w.poll_config}
            onChange={handleUpdate('watcher','poll_config',wrapper,w)}
          />
        </>);
        wrapper.form = form
        return wrapper;
      })
  }
  return (<>
    <Splitter style={{width: '100%'}}>
      <SplitterPanel>
        <Sidebar
          lists={{
            modules:{
              title:'Modules',
              type:'module',
              data:_modules,
            },
            watchers:{
              title:'Watchers',
              type:'watcher',
              data:_watchers,
            }
          }}
          onItemClick={item => {
            console.log('addEditor',item);
            addEditor(item)
          }}
          />
      </SplitterPanel>
      <SplitterPanel>
        <Editors
          editors={editors}
          onRemoveEditor={editor => {
            removeEditor(editor)
          }}
          onContentChange={fnFactory}
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
