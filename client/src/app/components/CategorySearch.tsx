import { debounce } from '@mui/material';
import React, { useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai';
import { setCatagoriesParams } from '../../features/admin/adminSlice';
import { useAppSelector, useAppDispatch } from '../store/configureStore';

const CategorySearch: React.FC = () => {
      const { categoriesParams } = useAppSelector((state) => state.admin);
      const dispatch = useAppDispatch();

      const [searchTerm, setSearchTerm] = useState(categoriesParams.searchTerm);

      const debouncedSearch = debounce((e: any) => {
          dispatch(setCatagoriesParams({ searchTerm: e.target.value }))
      }, 1000);

      return (
        <div className="relative">
          <input
            className="w-full border border-zinc-300 py-4 pl-[60px] rounded-xl focus:outline-none"
            placeholder="Search category..."
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

export default CategorySearch