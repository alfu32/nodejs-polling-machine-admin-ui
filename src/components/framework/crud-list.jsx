import * as React from "react";
import './crud-list.css'
import {XsButton} from "./xs-button";
export function CrudList({
  title,
  items,
  itemName=(it)=>it.name,
  onExpand=false,
  onEdit=false,
  onCreateRelated=false,
  onCopy=false,
  onDelete=false,
}){

  return <>
    <h4>{title}</h4>
    {
      items.loading?
        <>Loading</>:
        items.error?
          (<pre>items.error.message</pre>):
          items.data.map(
                (it,index,refAll) => <div className={'list-item'}>
                  {onExpand?<XsButton onClick={ev => onCreateRelated(title,items,it)}>
                      <i className="pi pi-plus" style={{fontSize:'12px'}}></i>
                    </XsButton>:[]}
                  <span className={'item-title'} onClick={ev => onEdit(title,items,it)}>{itemName(it)}</span>
                  <span className={'item-actions'}>
                    {onCreateRelated?<XsButton onClick={ev => onCreateRelated(title,items,it)}>
                      <i className="pi pi-plus" style={{fontSize:'12px'}}></i>
                    </XsButton>:[]}
                    {onCopy?<XsButton onClick={ev => onCopy(title,items,it)}>
                      <i className="pi pi-copy" style={{fontSize:'12px'}}></i>
                    </XsButton>:[]}
                    {onDelete?<XsButton onClick={ev => onDelete(title,items,it)}>
                      <i className="pi pi-trash" style={{fontSize:'12px'}}></i>
                    </XsButton>:[]}
                  </span>
                </div>
              )
    }
    </>
}