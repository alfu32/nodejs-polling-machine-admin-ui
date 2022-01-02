import * as React from "react";
import './small-button.css'

export function SmallButton({icon=[],onClick=(ev)=>{},children=[]}){  
  return (<div className="small-button" onClick={onClick}>
      {children}
    </div>)
}