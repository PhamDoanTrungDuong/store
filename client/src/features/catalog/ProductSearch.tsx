import { debounce, TextField } from "@mui/material";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setProductParams } from "./catalogSlice";

const ProductSearch: React.FC = () => {
  const { productParams } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();

  const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);

  const debouncedSearch = debounce((e: any) => {
      dispatch(setProductParams({ searchTerm: e.target.value }))
  }, 1000);

  return (
    <div>
      <TextField
        label="Search products..."
        variant="standard"
        fullWidth
        value={searchTerm || ""}
        onChange={(e: any) => {
            setSearchTerm(e.target.value);
            debouncedSearch(e);
        }}
      />
    </div>
  );
};

export default ProductSearch;
