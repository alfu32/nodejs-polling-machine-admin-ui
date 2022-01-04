import useFetch from 'use-http';
import {useState,useEffect} from 'react';

/*api generated at 'https://parallel-scarlet-juravenator.glitch.me'*/

export function useOwner_groups(host='https://parallel-scarlet-juravenator.glitch.me') {
  const [owner_groups, setOwner_groups] = useState([])
  const { get, post, put, del, response, loading, error } = useFetch(host)

  useEffect(() => { loadInitialOwner_groups() }, []) // componentDidMount
  
  async function loadInitialOwner_groups() {
    const initialOwner_groups = await get('/Owner_groups')
    if (response.ok) setOwner_groups(initialOwner_groups)
  }

  async function addOwner_group(owner_group) {
    const rp = await post('/Owner_group', owner_group)
    if (response.ok){
      console.log(rp);
      setOwner_groups([...owner_groups, rp]);
    }
  }
  async function updateOwner_group(owner_group) {
    await put('/Owner_group', owner_group)
    if (response.ok) {
      const newOwner_groups = owner_groups.filter(_owner_group => {
        return _owner_group.owner_group_id !== owner_group.owner_group_id;
      });
      setOwner_groups([...newOwner_groups, owner_group]);
    }
  }
  async function deleteOwner_group(owner_group) {
    console.log('deleting',owner_group)
    await del('/Owner_group/'+owner_group.owner_group_id)
    
    if (response.ok) {
      console.log('deleted',owner_group,response);
      const newOwner_groups = owner_groups.filter(_owner_group => {
        return _owner_group.owner_group_id !== owner_group.owner_group_id;
      });
      setOwner_groups(newOwner_groups);
    }
  }
  return [loading, error,owner_groups,addOwner_group,updateOwner_group,deleteOwner_group]
}