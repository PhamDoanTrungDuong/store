import { debounce } from "@mui/material";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setProductParams } from "./catalogSlice";
import {AiOutlineSearch} from "react-icons/ai";

const ProductSearch: React.FC = () => {
  const { productParams } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();

  const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);

  const debouncedSearch = debounce((e: any) => {
      dispatch(setProductParams({ searchTerm: e.target.value }))
  }, 1000);

  return (
    <div className="relative">
      <input
        className="w-full border border-zinc-300 py-4 pl-[60px] rounded-xl focus:outline-none"
        placeholder="Search product..."
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
};

export default ProductSearch;
