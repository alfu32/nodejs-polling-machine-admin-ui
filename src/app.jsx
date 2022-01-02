import React, { useState, useEffect } from "react";
import { Router, Link } from "wouter";
import {useFetch} from 'use-http';
import {config} from '../package.json';

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons

import { Splitter, SplitterPanel } from 'primereact/splitter';
import {useEditors} from "./hooks/editors";
import {Editors} from "./components/editors";
import {Sidebar} from "./components/sidebar";

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
  const [editors,addEditor,removeEditor,updateEditor] = useEditors([]);
  function fnFactory(key,editor){
    return (value)=>{
      console.log({editor, key, value});
    }
  }
  return (<>
    <Splitter style={{width: '100%'}}>
      <SplitterPanel>
        <Sidebar
          onItemClick={item => {addEditor({
          id:`${item.type}/${item.name}`,
          type:item.type,
          name:item.name,
          form:item.form,
        })}}/>
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
