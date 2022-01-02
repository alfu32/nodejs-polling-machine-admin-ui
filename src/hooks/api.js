import React,{useState} from "react";
import {config} from '../../package.json';
import {useFetch} from 'use-http';

export function useFetchModules(options={},m=[]){
  return useFetch(`${config.apiBaseUrl}/Module/getAll`, options,m)
}