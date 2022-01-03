import './xs-button.css'
import React from 'react';
import {log} from "../../service/logger";

export function XsButton({onClick,children}){
  return <div className={'xs-button'}
              onClick={(ev) => {onClick(ev);log('small-button','test')}}
  >{children}</div>
}