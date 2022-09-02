import { debounce } from '@mui/material';
import React, { useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai';
import { setCommentsParams } from '../../features/admin/adminSlice';
import { useAppSelector, useAppDispatch } from '../store/configureStore';

const CommentSearch: React.FC = () => {
    const { commentsParams } = useAppSelector((state) => state.admin);
    const dispatch = useAppDispatch();

    const [searchTerm, setSearchTerm] = useState(commentsParams.searchTerm);

    const debouncedSearch = debounce((e: any) => {
        dispatch(setCommentsParams({ searchTerm: e.target.value }))
    }, 1000);

    return (
      <div className="relative">
        <input
          className="w-full border border-zinc-300 py-4 pl-[60px] rounded-xl focus:outline-none"
          placeholder="Enter product name or user name"
          value={searchTerm || ""}
          onChange={(e: any) => {
              setSearchTerm(e.target.value);
              debouncedSearch(e);
          }}
        />
        <div className="absolute top-4 left-5 text-zinc-500">
          <AiOutlineSearch size={30} />
        </div>
      </div>
    );
}

export default CommentSearch