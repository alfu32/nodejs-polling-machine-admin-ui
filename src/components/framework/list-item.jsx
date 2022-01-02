import * as React from "react";
import './list-item.css'

export function ListItem({icon=[],onClick=(ev)=>{},children=[]}){  
  return (<div className="list-item" onClick={onClick}>
      {children}
    </div>)
}