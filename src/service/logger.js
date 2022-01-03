import {callPoint} from "./trace";

const colors={
  Reset      : "\x1b[0m",
  Bright     : "\x1b[1m",
  Dim        : "\x1b[2m",
  Underscore : "\x1b[4m",
  Blink      : "\x1b[5m",
  Reverse    : "\x1b[7m",
  Hidden     : "\x1b[8m",
  FgBlack    : "\x1b[30m",
  FgRed      : "\x1b[31m",
  FgGreen    : "\x1b[32m",
  FgYellow   : "\x1b[33m",
  FgBlue     : "\x1b[34m",
  FgMagenta  : "\x1b[35m",
  FgCyan     : "\x1b[36m",
  FgWhite    : "\x1b[37m",
  BgBlack    : "\x1b[40m",
  BgRed      : "\x1b[41m",
  BgGreen    : "\x1b[42m",
  BgYellow   : "\x1b[43m",
  BgBlue     : "\x1b[44m",
  BgMagenta  : "\x1b[45m",
  BgCyan     : "\x1b[46m",
  BgWhite    : "\x1b[47m",
}
const config = {
  log:{
    date:colors.FgYellow,
    callPoint:colors.FgBlue,
    text:colors.Reset
  },
  error:{
    date:colors.FgMagenta,
    callPoint:colors.FgRed,
    text:colors.Reset
  },
  warn:{
    date:colors.FgYellow,
    callPoint:colors.FgCyan,
    text:colors.Reset
  },
  dir:{
    date:colors.FgYellow,
    callPoint:colors.FgBlue,
    text:colors.Reset
  },
  time:{
    date:colors.FgYellow,
    callPoint:colors.FgBlue,
    text:colors.Reset
  },
  trace:{
    date:colors.FgYellow,
    callPoint:colors.FgBlue,
    text:colors.Reset
  },
  assert:{
    date:colors.FgYellow,
    callPoint:colors.FgGreen,
    text:colors.Reset
  },
  table:{
    date:colors.FgYellow,
    callPoint:colors.FgBlue,
    text:colors.Reset
  },
  debug:{
    date:colors.FgBlue,
    callPoint:colors.FgBlue,
    text:colors.Reset
  },
  info:{
    date:colors.FgYellow,
    callPoint:colors.FgBlue,
    text:colors.Reset
  },
  dirxml:{
    date:colors.FgYellow,
    callPoint:colors.FgBlue,
    text:colors.Reset
  },
}
window.subscribers=window.subscribers||[];
export function subscribe(subFn){
  window.subscribers.push(subFn);
}
function logFactory(methodName){
  return (...args)=>{
    const lastCallPoint =  callPoint();
    const datestamp = new Date().toISOString();
    const colorCfg=config[methodName];
    const prefix = `[${methodName.toUpperCase()}][${datestamp}][${lastCallPoint}]:`;
    console[methodName](prefix,...args);
    window.subscribers.forEach(subFn => {
      subFn({
        method:methodName,
        prefix,
        args:[...args]
      })
    })
  }
}

export const log=logFactory('log')
export const warn=logFactory('warn')
export const dir=logFactory('dir')
export const time=logFactory('time')
export const trace=logFactory('trace')
export const assert=logFactory('assert')
export const table=logFactory('table')
export const debug=logFactory('debug')
export const info=logFactory('info')
export const dirxml=logFactory('dirxml')
export const error=logFactory('error')


//// console. log
//// console. warn
//// console. dir
//// console. time
//// console. timeEnd
//// console. timeLog
//// console. trace
//// console. assert
//// console. clear
//// console. count
//// console. countReset
//// console. group
//// console. groupEnd
//// console. table
//// console. debug
//// console. info
//// console. dirxml
//// console. error
//// console. groupCollapsed
//// console. Console
//// console. profile
//// console. profileEnd
//// console. timeStamp
//// console. context
