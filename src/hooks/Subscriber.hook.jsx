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
    await post('/Subscriber', subscriber)
    if (response.ok) setSubscribers([...subscribers, subscriber]);
  }
  async function updateSubscriber(subscriber) {
    await put('/Subscribers', subscriber)
    if (response.ok) {
      const newSubscribers = subscribers.filter(_subscriber => {
        return _subscriber.watcher_id !== subscriber.watcher_id;
      });
      setSubscribers([...newSubscribers, subscriber]);
    }
  }
  async function deleteSubscriber(subscriber) {
    await del('/Subscribers', subscriber)
    
    if (response.ok) {
      const newSubscribers = subscribers.filter(_subscriber => {
        return _subscriber.watcher_id !== subscriber.watcher_id;
      });
      setSubscribers(newSubscribers);
    }
  }
  return [loading, error,subscribers,addSubscriber,updateSubscriber,deleteSubscriber]
}