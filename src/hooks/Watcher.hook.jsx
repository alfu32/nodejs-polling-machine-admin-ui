import useFetch from 'use-http';
import {useState,useEffect} from 'react';

/*api generated at 'https://parallel-scarlet-juravenator.glitch.me'*/

export function useWatchers(host='https://parallel-scarlet-juravenator.glitch.me',options={cacheLife: 0,cachePolicy: 'no-cache',}) {
  const [watchers, setWatchers] = useState([])
  const { get, post, put, del, response, loading, error } = useFetch(host,options)

  useEffect(() => { loadInitialWatchers() }, []) // componentDidMount
  
  async function loadInitialWatchers() {
    const initialWatchers = await get('/Watchers')
    if (response.ok) setWatchers(initialWatchers)
  }

  async function addWatcher(watcher) {
    const rp = await post('/Watcher', watcher)
    if (response.ok){
      console.log(rp);
      setWatchers([...watchers, rp]);
    }
  }
  async function updateWatcher(watcher) {
    await put('/Watcher', watcher)
    if (response.ok) {
      const newWatchers = watchers.filter(_watcher => {
        return _watcher.watcher_id !== watcher.watcher_id;
      });
      setWatchers([...newWatchers, watcher]);
    }
  }
  async function deleteWatcher(watcher) {
    console.log('deleting',watcher)
    await del('/Watcher/'+watcher.watcher_id)
    
    if (response.ok) {
      console.log('deleted',watcher,response);
      const newWatchers = watchers.filter(_watcher => {
        return _watcher.watcher_id !== watcher.watcher_id;
      });
      setWatchers(newWatchers);
    }
  }
  return [loading, error,watchers,addWatcher,updateWatcher,deleteWatcher]
}