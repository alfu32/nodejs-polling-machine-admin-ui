import useFetch from 'use-http';
import {useState,useEffect} from 'react';

/*api generated at 'https://parallel-scarlet-juravenator.glitch.me'*/

export function useNotifiers(host='https://parallel-scarlet-juravenator.glitch.me',options={cacheLife: 0,cachePolicy: 'no-cache',}) {
  const [notifiers, setNotifiers] = useState([])
  const { get, post, put, del, response, loading, error } = useFetch(host,options)

  useEffect(() => { loadInitialNotifiers() }, []) // componentDidMount
  
  async function loadInitialNotifiers() {
    const initialNotifiers = await get('/Notifiers')
    if (response.ok) setNotifiers(initialNotifiers)
  }

  async function addNotifier(notifier) {
    const rp = await post('/Notifier', notifier)
    if (response.ok){
      console.log(rp);
      setNotifiers([...notifiers, rp]);
    }
  }
  async function updateNotifier(notifier) {
    await put('/Notifier', notifier)
    if (response.ok) {
      const newNotifiers = notifiers.filter(_notifier => {
        return _notifier.notifier_id !== notifier.notifier_id;
      });
      setNotifiers([...newNotifiers, notifier]);
    }
  }
  async function deleteNotifier(notifier) {
    console.log('deleting',notifier)
    await del('/Notifier/'+notifier.notifier_id)
    
    if (response.ok) {
      console.log('deleted',notifier,response);
      const newNotifiers = notifiers.filter(_notifier => {
        return _notifier.notifier_id !== notifier.notifier_id;
      });
      setNotifiers(newNotifiers);
    }
  }
  return [loading, error,notifiers,addNotifier,updateNotifier,deleteNotifier]
}