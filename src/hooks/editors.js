import {useEffect, useState} from 'react';
import {log} from "../service/logger";
import {after} from "../service/delay";

export function useEditors(){
  const [editors,setEditors]=useState({});
  const addEditor = (object)=>{
    const newEditors= {...editors};
    newEditors[object.id]=object;
    console.log('useEditors.addEditor',{editors,newEditors})
    setEditors(newEditors)
  }
  const removeEditor = (object)=>{
    const newEditors= {...editors};
    delete newEditors[object.id]
    console.log('useEditors.removeEditor',{editors,newEditors})
    setEditors(newEditors)
  }
  const updateEditor = (object)=>{
    const newEditors= {...editors};
    delete newEditors[object.id];
    newEditors[object.id]=object;
    console.log('useEditors.updateEditor',{editors,newEditors})
    setEditors(newEditors)
  }
  return [editors,addEditor,removeEditor,updateEditor];
}