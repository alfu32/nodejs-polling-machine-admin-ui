import './xs-button.css'
import React from 'react';

export function XsButton({onClick,children}){
  return <div className={'xs-button'}
              onClick={onClick}
  >{children}</div>
}