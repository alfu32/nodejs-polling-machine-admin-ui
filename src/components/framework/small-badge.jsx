import * as React from "react";
import './small-badge.css';
import {log} from "../../service/logger";

export function SmallBadge({icon=[],onClick=(ev)=>{},children=[]}){  
  return (<div className="small-badge" onClick={(ev) => {onClick(ev);log('small-badge','test')}}>
      {children}
    </div>)
}