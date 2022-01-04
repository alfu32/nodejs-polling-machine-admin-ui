import * as React from "react";
import './crud-list.css'
import {XsButton} from "./xs-button";
import { confirmDialog } from 'primereact/confirmdialog'; // To use confirmDialog method
import { Skeleton } from 'primereact/skeleton';

export function CrudList({
  children,
  sublist,
  title,
  items,
  create,
  loading,
  error,
  itemName=(it)=>it.name,
  onExpand=false,
  onEdit=false,
  onCreateRelated=false,
  onCopy=false,
  onDelete=false,
}){

  return <>
    <div>
      <strong>{title}</strong>
      {
        create
          ?<XsButton onClick={ev => create()}>
            <i className="pi pi-plus" style={{fontSize:'12px'}}></i>
          </XsButton>
          :[]
      }
    </div>
    {
      loading?
        <>Loading</>:
        error?
          (<pre>items.error.message</pre>):
          items.map(
                (it,index,refAll) => <div className={'list-item'} key={it.name+'-'+index}>
                  {onExpand?<XsButton onClick={ev => onExpand(title,items,it)}>
                    {it.expanded
                        ?<i className="pi pi-chevron-up" style={{fontSize:'12px'}}></i>
                        :<i className="pi pi-chevron-down" style={{fontSize:'12px'}}></i>
                    }
                    </XsButton>:[]}
                  <span className={'item-title'} onClick={ev => onEdit(title,items,it)}>{itemName(it)}</span>
                  <span className={'item-actions'}>
                    {onCreateRelated?<XsButton onClick={ev => onCreateRelated(title,items,it)}>
                      <i className="pi pi-plus" style={{fontSize:'12px'}}></i>
                    </XsButton>:[]}
                    {onCopy?<XsButton onClick={ev => {
                          confirmDialog({
                              message: `Are you sure you want to duplicate ${it.name} from ${title}?`,
                              header: 'Confirmation',
                              icon: 'pi pi-exclamation-triangle',
                              accept: () => onCopy(title,items,it),
                              reject: () => {}
                          });
                        }}>
                      <i className="pi pi-copy" style={{fontSize:'12px'}}></i>
                    </XsButton>:[]}
                    {onDelete?<XsButton onClick={ev => {
                          confirmDialog({
                              message: `Are you sure you want to delete ${it.name} from ${title}?`,
                              header: 'Confirmation',
                              icon: 'pi pi-exclamation-triangle',
                              accept: () => onDelete(title,items,it),
                              reject: () => {}
                          });
                        }}>
                      <i className="pi pi-trash" style={{fontSize:'12px'}}></i>
                    </XsButton>:[]}
                  </span>
                  {it.expanded?children:[]}
                  {it.expanded?sublist(it):[]}
                </div>
              )
    }
    </>
}