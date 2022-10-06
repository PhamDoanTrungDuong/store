import { debounce } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setProductParams } from "./catalogSlice";
import {AiOutlineSearch} from "react-icons/ai";
import {MdOutlineKeyboardVoice} from "react-icons/md";
import useRecognition from "../../app/hooks/useRecognition";

const ProductSearch: React.FC = () => {
  const { productParams } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();

  const { recognition, content, isVoice, error, errorMess } = useRecognition();

  const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);

  const debouncedSearch = debounce((e: any) => {
      dispatch(setProductParams({ searchTerm: e.target.value }))
  }, 1000);

  const handleVoice = () => {
      recognition.start()
  }
  useEffect(() => {
    if(content !== undefined){
      setSearchTerm(content)
      dispatch(setProductParams({ searchTerm: content }))
    }
  }, [content, dispatch])

  return (
    <div className="relative">
      <input
        // className="w-[88%] border border-zinc-300 py-4 pl-[60px] rounded-xl focus:outline-none"
        className="w-[100%] border border-zinc-300 py-4 pl-[60px] rounded-xl focus:outline-none"
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
      {/* <div>
        <div className="absolute top-1 right-5 p-2 text-zinc-500 border border-zinc-100 cursor-pointer hover:scale-125 hover:border-transparent hover:text-sky-500 hover:bg-sky-200/30 rounded-full duration-200" onClick={handleVoice}>
          <MdOutlineKeyboardVoice size={33} />
        </div>
        <div className="absolute top-15 right-1">
            <span className="text-sky-500">{isVoice === true ? "Recording..." : ""}</span>
            <span className="text-red-600">{error === true ? errorMess : ""}</span> 
        </div>
      </div> */}
    </div>
  );
};

export default ProductSearch;
