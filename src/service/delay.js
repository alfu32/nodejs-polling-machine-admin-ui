export function after(millis){
  return {
    run:async (fn)=>{
      const _default=()=>{console.log('noop');return 1;}
      return new Promise((resolve,reject) => {
        setTimeout(()=>{
          try{
            const r = (fn||_default)();
            resolve(r);
          }catch(e){
            reject(e);
          }
        },millis);
      })
    }
  }
}