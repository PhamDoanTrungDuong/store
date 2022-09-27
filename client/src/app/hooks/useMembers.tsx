import { useEffect } from 'react';
import { fetchMembersAsync, membersSelector } from '../../features/account/accountSlice'
import { useAppSelector, useAppDispatch } from '../store/configureStore'

const useMembers = () => {
      const members = useAppSelector(membersSelector.selectAll);
      const { membersLoaded, pagination } = useAppSelector(state => state.account);

      const dispatch = useAppDispatch();

      useEffect(() => {
         !membersLoaded ? dispatch(fetchMembersAsync()) : dispatch(fetchMembersAsync());
            // dispatch(fetchMembersAsync())
      }, [dispatch, membersLoaded]);

  return {
      members,
      pagination,
      membersLoaded
  }
}

export default useMembers