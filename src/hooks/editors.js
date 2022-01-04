import {useEffect, useState} from 'react';
import {log} from "../service/logger";
import {after} from "../service/delay";

export function useEditors(){
  const [editors,setEditors]=useState({});
  const addEditor = (object)=>{
    const newEditors= {...editors};
    newEditors[object.id]=object;
    setEditors(newEditors)
  }
  const removeEditor = (object)=>{
    const newEditors= {...editors};
    delete newEditors[object.id]
    setEditors(newEditors)
  }
  const updateEditor = (object)=>{
    const newEditors= {...editors};
    delete newEditors[object.id];
    newEditors[object.id]=object;
    setEditors(newEditors)
  }
  return [editors,addEditor,removeEditor,updateEditor];
}