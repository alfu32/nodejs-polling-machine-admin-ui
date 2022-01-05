import {useEffect, useState} from 'react';
import {log} from "../service/logger";
import {after} from "../service/delay";

export function useEditors(){
  const [editors,setEditors] = useState([]);
  const addEditor=(item)=>{
    const f = editors.find(it => it.id===item.id);
    if(!f){
      const ed=[...editors];
      ed.push(item);
      setEditors(ed); 
    }
  }
  const removeEditor=(item)=>{
    const ed=editors.filter(it => it.id!==item.id);
    setEditors(ed);
  }
  const updateEditor=(item)=>{
    const ed=[...editors];
    const iof = ed.reduce((iof,it,i)=>{
      if(it.id!==item.id){
        return iof;
      } else {
        return i;
      }
    },-1);
    if(iof === -1 ){
      ed.push(item);  
    } else {
      ed[iof]=item;
    }
    setEditors(ed);
  }
  return [editors,addEditor,removeEditor,updateEditor];
}