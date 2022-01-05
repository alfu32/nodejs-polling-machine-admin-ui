import useFetch from 'use-http';
import {useState,useEffect} from 'react';

/*api generated at 'https://parallel-scarlet-juravenator.glitch.me'*/

export function useModules(host='https://parallel-scarlet-juravenator.glitch.me',options={cacheLife: 0,cachePolicy: 'no-cache',}) {
  const [modules, setModules] = useState([])
  const { get, post, put, del, response, loading, error } = useFetch(host,options)

  useEffect(() => { loadInitialModules() }, []) // componentDidMount
  
  async function loadInitialModules() {
    const initialModules = await get('/Modules')
    if (response.ok) setModules(initialModules)
  }

  async function addModule(module) {
    const rp = await post('/Module', module)
    if (response.ok){
      console.log(rp);
      setModules([...modules, rp]);
    }
  }
  async function updateModule(module) {
    await put('/Module', module)
    if (response.ok) {
      const newModules = modules.filter(_module => {
        return _module.module_id !== module.module_id;
      });
      setModules([...newModules, module]);
    }
  }
  async function deleteModule(module) {
    console.log('deleting',module)
    await del('/Module/'+module.module_id)
    
    if (response.ok) {
      console.log('deleted',module,response);
      const newModules = modules.filter(_module => {
        return _module.module_id !== module.module_id;
      });
      setModules(newModules);
    }
  }
  return [loading, error,modules,addModule,updateModule,deleteModule]
}