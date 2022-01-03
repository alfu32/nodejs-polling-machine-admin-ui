import * as React from "react";
import './small-button.css';
import {log} from "../../service/logger";

export function SmallButton({icon=[],onClick=(ev)=>{},children=[]}){  
  return (<div className="small-button" onClick={(ev) => {onClick(ev);log('small-button','test')}}>
      {children}
    </div>)
}