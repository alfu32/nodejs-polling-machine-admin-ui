import useFetch from 'use-http';
import {useState,useEffect} from 'react';

/*api generated at 'https://parallel-scarlet-juravenator.glitch.me'*/

export function useObservables(host='https://parallel-scarlet-juravenator.glitch.me',options={cacheLife: 0,cachePolicy: 'no-cache',}) {
  const [observables, setObservables] = useState([])
  const { get, post, put, del, response, loading, error } = useFetch(host,options)

  useEffect(() => { loadInitialObservables() }, []) // componentDidMount
  
  async function loadInitialObservables() {
    const initialObservables = await get('/Observables')
    if (response.ok) setObservables(initialObservables)
  }

  async function addObservable(observable) {
    const rp = await post('/Observable', observable)
    if (response.ok){
      console.log(rp);
      setObservables([...observables, rp]);
    }
  }
  async function updateObservable(observable) {
    await put('/Observable', observable)
    if (response.ok) {
      const newObservables = observables.filter(_observable => {
        return _observable.observable_id !== observable.observable_id;
      });
      setObservables([...newObservables, observable]);
    }
  }
  async function deleteObservable(observable) {
    console.log('deleting',observable)
    await del('/Observable/'+observable.observable_id)
    
    if (response.ok) {
      console.log('deleted',observable,response);
      const newObservables = observables.filter(_observable => {
        return _observable.observable_id !== observable.observable_id;
      });
      setObservables(newObservables);
    }
  }
  return [loading, error,observables,addObservable,updateObservable,deleteObservable]
}