import React,{useState,useEffect} from "react";
import './crud-list.css'
import {XsButton} from "./xs-button";
import { confirmDialog } from 'primereact/confirmdialog'; // To use confirmDialog method
import { Skeleton } from 'primereact/skeleton';

const Spacer = () => <div style={{margin:'3px',minHeigh:'2px'}}/>;
const SkeletonList = ({size}) => new Array(size||5).fill(0).map((n,i) => <div key={'sk-'+i}><Skeleton/><Spacer/></div>);

export function CrudList({
  children,
  sublist,
  title,
  parentItem,
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
  const [maxSize,setMaxSize]=useState(1);
  useEffect(()=>{
    const len = items.length?items.length:1;
    setMaxSize(len>maxSize?len:maxSize);
  },[items])
  return <>
    <div>
      <strong>{title} [{maxSize}]</strong>
      {
        create
          ?<XsButton onClick={ev => create(parentItem)}>
            <i className="pi pi-plus" style={{fontSize:'12px'}}></i>
          </XsButton>
          :[]
      }
    </div>
    {
      loading?
        <SkeletonList size={maxSize}/>:
        error?
          (<pre>{items.error.message}</pre>):
          items.map(
                (it,index,refAll) => <>
                  <div className={'list-item'} key={it.name+'-'+index}>
                    {onExpand?<XsButton onClick={ev => onExpand(it,items)}>
                      {it.expanded
                          ?<i className="pi pi-chevron-up" style={{fontSize:'12px'}}></i>
                          :<i className="pi pi-chevron-down" style={{fontSize:'12px'}}></i>
                      }
                      </XsButton>:[]}
                    <span className={'item-title'} onClick={ev => onEdit(it,items)}>{itemName(it)}</span>
                    <span className={'item-actions'}>
                      {onCreateRelated?<XsButton onClick={ev => onCreateRelated(it,items)}>
                        <i className="pi pi-plus" style={{fontSize:'12px'}}></i>
                      </XsButton>:[]}
                      {onCopy?<XsButton onClick={ev => {
                            confirmDialog({
                                message: `Are you sure you want to duplicate ${it.name} from ${title}?`,
                                header: 'Confirmation',
                                icon: 'pi pi-exclamation-triangle',
                                accept: () => onCopy(it,items),
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
                                accept: () => {
                                  onDelete(it,items);
                                  setMaxSize(maxSize-1)
                                },
                                reject: () => {}
                            });
                          }}>
                        <i className="pi pi-trash" style={{fontSize:'12px'}}></i>
                      </XsButton>:[]}
                    </span>
                    {it.expanded?children:[]}
                    {it.expanded?sublist(it):[]}
                  </div>
                  <Spacer/>
                </>
              )
    }
    </>
}