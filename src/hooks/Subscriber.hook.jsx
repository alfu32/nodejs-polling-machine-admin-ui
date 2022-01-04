import useFetch from 'use-http';
import {useState,useEffect} from 'react';

/*api generated at 'https://parallel-scarlet-juravenator.glitch.me'*/

export function useSubscribers(host='https://parallel-scarlet-juravenator.glitch.me') {
  const [subscribers, setSubscribers] = useState([])
  const { get, post, put, del, response, loading, error } = useFetch(host)

  useEffect(() => { loadInitialSubscribers() }, []) // componentDidMount
  
  async function loadInitialSubscribers() {
    const initialSubscribers = await get('/Subscribers')
    if (response.ok) setSubscribers(initialSubscribers)
  }

  async function addSubscriber(subscriber) {
    const rp = await post('/Subscriber', subscriber)
    if (response.ok){
      console.log(rp);
      setSubscribers([...subscribers, rp]);
    }
  }
  async function updateSubscriber(subscriber) {
    await put('/Subscriber', subscriber)
    if (response.ok) {
      const newSubscribers = subscribers.filter(_subscriber => {
        return _subscriber.watcher_id !== subscriber.watcher_id;
      });
      setSubscribers([...newSubscribers, subscriber]);
    }
  }
  async function deleteSubscriber(subscriber) {
    console.log('deleting',subscriber)
    await del('/Subscriber/'+subscriber.watcher_id)
    
    if (response.ok) {
      console.log('deleted',subscriber,response);
      const newSubscribers = subscribers.filter(_subscriber => {
        return _subscriber.watcher_id !== subscriber.watcher_id;
      });
      setSubscribers(newSubscribers);
    }
  }
  return [loading, error,subscribers,addSubscriber,updateSubscriber,deleteSubscriber]
}