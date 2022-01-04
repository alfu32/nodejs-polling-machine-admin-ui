import useFetch from 'use-http';
import {useState,useEffect} from 'react';

/*api generated at 'https://parallel-scarlet-juravenator.glitch.me'*/

export function useNotifiers(host='https://parallel-scarlet-juravenator.glitch.me') {
  const [notifiers, setNotifiers] = useState([])
  const { get, post, put, del, response, loading, error } = useFetch(host)

  useEffect(() => { loadInitialNotifiers() }, []) // componentDidMount
  
  async function loadInitialNotifiers() {
    const initialNotifiers = await get('/Notifiers')
    if (response.ok) setNotifiers(initialNotifiers)
  }

  async function addNotifier(notifier) {
    await post('/Notifier', notifier)
    if (response.ok) setNotifiers([...notifiers, notifier]);
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
    await del('/Notifier', notifier)
    
    if (response.ok) {
      const newNotifiers = notifiers.filter(_notifier => {
        return _notifier.notifier_id !== notifier.notifier_id;
      });
      setNotifiers(newNotifiers);
    }
  }
  return [loading, error,notifiers,addNotifier,updateNotifier,deleteNotifier]
}