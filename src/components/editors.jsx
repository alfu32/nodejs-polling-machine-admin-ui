import React, {useEffect} from 'react';
import { TabView, TabPanel } from 'primereact/tabview';

import Editor from "@monaco-editor/react";
import {useState} from "react";
import {XsButton} from "./framework/xs-button";
import './editors.css'



export function Editors({editors,onRemoveEditor,onContentChange,children}){
  const [activeIndex, setActiveIndex] = useState(0);
  return (<TabView activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}>
    {
      Object.values(editors).map((editor,index) =>
        <TabPanel
          header={`${editor.type}/${editor.name}`}
          headerTemplate={options => {
            return <div className={'tab-header'}>
              <span onClick={ev => setActiveIndex(index)}>{editor.type}/{editor.name}</span>
              <XsButton onClick={ev => onRemoveEditor(editor)}>
                <i className="pi pi-times" style={{fontSize:'12px'}}></i>
              </XsButton>
            </div>
          }}
        >
        {editor.form}
        </TabPanel>)
    }
  </TabView>)
}
