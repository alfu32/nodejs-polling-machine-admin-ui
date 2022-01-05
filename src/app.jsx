import React, { useState, useEffect,useRef } from "react";
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
import { Toast } from 'primereact/toast';
import {useModules,useWatchers,useSubscribers,useNotifiers} from './hooks/api.hooks';
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
  const toast =  useRef(null);
  const [loadingModules, errorModules,modules,addModule,updateModule,deleteModule] = useModules();
  const [loadingWatchers, errorWatchers,watchers,addWatcher,updateWatcher,deleteWatcher] = useWatchers();
  const [loadingSubscribers, errorSubscribers,subscribers,addSubscriber,updateSubscriber,deleteSubscriber] = useSubscribers();
  const [loadingNotifiers, errorNotifiers,notifiers,addNotifier,updateNotifier,deleteNotifier] = useNotifiers();
  console.log({
    loadingModules,
    loadingWatchers,
    modules,
    watchers,
  })
  /// const modules = useFetch(`${config.apiBaseUrl}/Modules`, {method:'GET'}, []);
  /// const watchers = useFetch(`${config.apiBaseUrl}/Watchers`, {method:'GET'}, []);
  /// console.log({modules,watchers});
  const success=(message)=>toast.current.show({severity: 'success', summary: 'Success Message', detail: message});
  const info=(message)=>toast.current.show({severity: 'info', summary: 'Info Message', detail: message});
  const warn=(message)=>toast.current.show({severity: 'warning', summary: 'Warning Message', detail: message});
  const error=(message)=>toast.current.show({severity: 'error', summary: 'Error Message', detail: message});
  
  const [editors,addEditor,removeEditor,updateEditor] = useEditors();
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
      success(`Document ${editor.name} saved`);
    }catch(err){
      console.error('error saving',{editor,newItem,err});
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
  function editItem(editor) {
    log('sidebar.launch.edit-editor',editor);
    console.log('addEditor',editor,editors);
    addEditor(editor);
  }
  async function deleteItem(editor) {
    log('sidebar.delete.edit-editor',editor);
    console.log('delete-editor',editor);
    try{
      const result = await editor.api.delete(editor.item);
      console.log('deleted',result,editor)
      info(`Document ${editor.name} deleted`);
    }catch(err){
      error(`Document ${editor.name} was not deleted`);
    }
  }
  async function copyItem(editor) {
    log('sidebar.copy.edit-editor',editor);
    console.log('copy-editor',editor);
    try{
      const result = await editor.api.copy(editor.item);
      console.log('copied',result,editor)
      info(`Document ${editor.name} copied`);
    }catch(err){
      error(`Document ${editor.name} was not copied`);
    }
  }
  const [lists,setLists]=useState({});
  const [expanded,setExpanded]=useState({});
  useEffect(()=>{
    const _modules = (loadingModules?[]:(modules||[]))
      .map(m=>{
        const wrapper = {
          item:m,
          id:`m/${m.module_id}`,
          type:'module',
          name:`${m.npm_module}/${m.injection_ref_name}/${m.module_id}`,
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
          {m.npm_module.length==0
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
      });
    const _watchers = (loadingWatchers?[]:(watchers||[]))
        .map(w=>{
          const wrapper = {
            item:w,
            id:`w/${w.watcher_id}`,
            type:'watcher',
            name:w.name,
            expanded:!!expanded[w.watcher_id],
            api:{
              add:addWatcher,
              update:updateWatcher,
              delete:deleteWatcher,
              copy:async (watcher)=>{
                const newWatcher = {...watcher}
                newWatcher.name+=' copy'
                try{
                  await addWatcher(newWatcher);
                  success('Watcher copied');
                }catch(err){
                  console.error('error copying',{newWatcher});
                  error('Error copying Watcher');
                }
              },
            },
          };
          const form = (<>
            Watcher Id : {w.watcher_id}<br/>
            Name : <input type="text" size={80} defaultValue={w.name} onChange={handleInputUpdate('watcher','name',wrapper)}/><br/>
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
              height="40vh"
              theme="vs-dark"
              defaultLanguage="javascript"
              defaultValue={w.poll_config}
              onChange={handleUpdate('watcher','poll_config',wrapper)}
            />
          </>);
          wrapper.form = form
          return wrapper;
        });
    const _subscribers = (loadingSubscribers?[]:(subscribers||[]))
        .map(s=>{
          const wrapper = {
            item:s,
            id:`s/${s.subscriber_id}`,
            type:'subscriber',
            name:s.name,
            expanded:!!expanded[s.subscriber_id],
            api:{
              add:addSubscriber,
              update:updateSubscriber,
              delete:deleteSubscriber,
              copy:async (subscriber)=>{
                const newSubscriber = {...subscriber}
                newSubscriber.name+=' copy'
                try{
                  await addWatcher(newSubscriber);
                  success('Subscriber copied');
                }catch(err){
                  console.error('error copying',{newSubscriber});
                  error('Error copying Subscriber');
                }
              },
            },
          };
          const form = (<>
            Subscriber Id : {s.subscriber_id}<br/>
            Name : <input type="text" size={80} defaultValue={s.name} onChange={handleInputUpdate('subscriber','name',wrapper)}/><br/>
            Code:<br/>
                <Editor
              height="40vh"
              theme="vs-dark"
              defaultLanguage="javascript"
              defaultValue={s.source}
              onChange={handleUpdate('subscriber','source',wrapper)}
            />
          </>);
          wrapper.form = form
          return wrapper;
        });
    const _notifiers = (loadingNotifiers?[]:(notifiers||[]))
        .map(n=>{
          const wrapper = {
            item:n,
            id:`n/${n.notifier_id}`,
            type:'notifier',
            name:n.name,
            api:{
              add:addNotifier,
              update:updateNotifier,
              delete:deleteNotifier,
              copy:async (notifier)=>{
                const newNotifier = {...notifier}
                newNotifier.name+=' copy'
                try{
                  await addNotifier(newNotifier);
                  success('Notifier copied');
                }catch(err){
                  console.error('error copying',{newNotifier});
                  error('Error copying Notifier');
                }
              },
            },
          };
          const form = (<>
            Watcher Id : {n.notifier_id}<br/>
            Name : <input type="text" size={80} defaultValue={n.name} onChange={handleInputUpdate('notifier','name',wrapper)}/><br/>
            Code:<br/>
                <Editor
              height="40vh"
              theme="vs-dark"
              defaultLanguage="javascript"
              defaultValue={n.source}
              onChange={handleUpdate('notifier','source',wrapper)}
            />
          </>);
          wrapper.form = form
          return wrapper;
        });
      const modulesList = {
        title:'Modules',
        type:'module',
        loading:loadingModules,
        error:errorModules,
        create:async ()=>{
          const newModule = {
            "owner_group_id": null,
            "injection_ref_name": "moment",
            "npm_module": "",
            "source": "module.exports≈{\n        /* this function signature*/\n        main:({modules,metadata})=>{\n          return [{val:444}]\n        },\n      }"
          }
          try{
            await addModule(newModule);
            success('Module created');
          }catch(err){
            console.error('error creating',{newModule});
          }
        },
        data:_modules,
        onExpand:false,
        onEdit:(item,items)=>{editItem(item)},
        onCreateRelated:false,
        onCopy:false,
        onDelete:(item,items)=>{deleteItem(item)},
        sublist:(item)=>[],
      }
      const notifiersList={
          title:'Notifiers',
          type:'notifiers',
          loading:loadingNotifiers,
          error:errorNotifiers,
          create:async (parent)=>{
            const newNotifier = {
              "subscriber_id": parent.item.subscriber_id,
              "name":`${parent.item.name}/notifier`,
              "owner_group_id": null,
              "source": "module.exports≈{\n        main({modules,data}){\n          return [{val:444}]\n        },\n      }"
            }
            try{
              await addNotifier(newNotifier);
              success(`Notifier for ${parent.item.name} created`);
            }catch(err){
              console.error(`Error creating notifier to ${parent.item.name}`,{newNotifier});
            }
          },
          data:_notifiers,
          onExpand:false,
          onEdit:(item,items)=>{editItem(item)},
          onCreateRelated:false,
          onCopy:false,
          onDelete:(item,items)=>{deleteItem(item)},
          sublist:(item)=>[],
        }
      const subscribersList={
          title:'Subscribers',
          type:'notifiers',
          loading:loadingSubscribers,
          error:errorSubscribers,
          create:async (parent)=>{
            const newSubscriber = {
              "watcher_id": parent.item.watcher_id,
              "name":`${parent.item.name}/subscriber`,
              "owner_group_id": null,
              "source": "module.exports≈{\n        main({modules,data}){\n          return [{val:444}]\n        },\n      }"
            }
            try{
              await addSubscriber(newSubscriber);
              success(`Subscriber to ${parent.item.name} created`);
            }catch(err){
              console.error(`Error creating subscriber to ${parent.item.name}`,{newSubscriber});
            }
          },
          data:_subscribers,
          onExpand:(items,editor)=>{
            const key = editor.item.subscriber_id;
            expanded[key]=!expanded[key];
            console.log({lists,items});
            setExpanded({...expanded});
          },
          onEdit:(item,items)=>{editItem(item)},
          onCreateRelated:false,
          onCopy:false,
          onDelete:(item,items)=>{deleteItem(item)},
          sublist:(item) => {
              return <CrudList
                key={notifiersList.title}
                title={notifiersList.title}
                parentItem={item}
                create={notifiersList.create}
                loading={notifiersList.loading}
                error={notifiersList.error}
                itemName={it => it.name}
                items={notifiersList.data.filter(notifier => {
                  return notifier.item.subscriber_id===item.item.subscriber_id
                })}
                onExpand={notifiersList.onExpand}
                onEdit={notifiersList.onEdit}
                onCreateRelated={notifiersList.onCreateRelated}
                onCopy={notifiersList.onCopy}
                onDelete={notifiersList.onDelete}
              >
              <div>coucou</div>
            </CrudList>
          }
        }
      const watchersList={
        title:'Watchers',
        type:'watcher',
        loading:loadingWatchers,
        error:errorWatchers,
        create:async ()=>{
          const newWatcher = {
            name: "carl-read-closed",
            owner_group_id: null,
            poll_config: "// variable interval :\n// very high frequency from Mo to Fr between 9:00 and 16:00 ( 10 seconds )\n// high frequency from Mo to Fr between 6:00 and 20:00 ( 1 minute )\n// low freq Mo to Fr outside 6:00 to 20:00 ( 5 minutes )\n// very low frequency during weekends ( 1 hour )\nmodule.exports = function nextInterval(){\n  const crt = new Date();\n  if(crt.getHours() <= 20 && crt.getHours() >= 6){\n    if(crt.getDay() >= 1  && crt.getDay() <= 5){\n      return crt.getTime()+60_000;\n    } else {\n      return crt.getTime()+3600_000;\n    }\n  } else {\n    return crt.getTime()+300_000\n  }\n}",
            source: "module.exports = {\n  main({modules,data}){\n    // returns a list of watch results\n    // the list is persisted as a watch\n    // each watch must have a unique watch_id\n    // and a payload json object\n    return [{watch_id:444,payload:444}]\n  },\n}",
          }
          try{
            await addWatcher(newWatcher);
            success('Watcher created');
          }catch(err){
            console.error('error creating',{newWatcher});
          }
        },
        data:_watchers,
        onExpand:(items,editor)=>{
          const key = editor.item.watcher_id;
          expanded[key]=!expanded[key];
          console.log({lists,items});
          setExpanded({...expanded});
        },
        onEdit:(item,items)=>{editItem(item)},
        onCreateRelated:false,
        onCopy:(item,items)=>{copyItem(item)},
        onDelete:(item,items)=>{deleteItem(item)},
        sublist:(item) => {
            return <CrudList
              key={subscribersList.title}
              title={subscribersList.title}
              parentItem={item}
              create={subscribersList.create}
              loading={subscribersList.loading}
              error={subscribersList.error}
              itemName={it => it.name}
              items={subscribersList.data.filter(subscriber => {
                return subscriber.item.watcher_id===item.item.watcher_id
              })}
              onExpand={subscribersList.onExpand}
              onEdit={subscribersList.onEdit}
              onCreateRelated={subscribersList.onCreateRelated}
              onCopy={subscribersList.onCopy}
              onDelete={subscribersList.onDelete}
              sublist={subscribersList.sublist}
            >
            <div>coucou</div>
          </CrudList>
        }
      }
    setLists({
      modules:modulesList,
      watchers:watchersList,
    })
  },[modules,watchers,notifiers,subscribers,loadingModules,loadingWatchers,loadingNotifiers,loadingSubscribers,expanded]);
  return (<>
    <Splitter style={{width: '100%'}}>
      <SplitterPanel>
        {Object.values(lists)
        .map(
          list => <CrudList
            key={list.title}
            title={list.title}
            parentItem={null}
            create={list.create}
            loading={list.loading}
            error={list.error}
            itemName={it => it.name}
            items={list.data}
            onExpand={list.onExpand}
            onEdit={list.onEdit}
            onCreateRelated={list.onCreateRelated}
            onCopy={list.onCopy}
            onDelete={list.onDelete}
            sublist={list.sublist}
          >
          </CrudList>
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
      <Toast ref={toast}/>
      <pre>{JSON.stringify(Object.keys(editors),null," ")}</pre>
      <pre>{JSON.stringify(expanded,null," ")}</pre>
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
