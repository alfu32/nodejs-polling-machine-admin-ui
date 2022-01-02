import * as React from "react";
import {SmallButton} from './framework/small-button';
import {ListItem} from './framework/list-item';

export function ModuleList({modules,onClick=(()=>{}),onAdd=(()=>{})}){
  return (<>
    <div>ModulesList <SmallButton>+</SmallButton></div>
    {
      modules.map(
        module => <div className="module">
          <ListItem onClick={ev => onClick(module)}>{module.npm_module}</ListItem>
          <SmallButton>D</SmallButton>
        </div>
      )
    }
    
  </>)
}