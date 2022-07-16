import { Box, Pagination, Typography } from "@mui/material";
import React, { useState } from "react";
import { IPagination } from "../interfaces/IPagination";

interface IProps {
  pagination: IPagination;
  onPageChange: (page: number) => void;
}

const AppPagination: React.FC<IProps> = ({ pagination, onPageChange }) => {
  const { currentPage, totalCount, totalPages, pageSize } = pagination;
  const [pageNumber, setPageNumber] = useState(currentPage);

  const handlePageChange = (page: number) => {
    setPageNumber(page);
    onPageChange(page)
  }
  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography>
          Displaying {(currentPage - 1) * pageSize + 1}-
          {currentPage * pageSize > totalCount
            ? totalCount
            : currentPage * pageSize} of { totalCount} items
        </Typography>
        <Pagination
          color="primary"
          size="large"
          count={totalPages}
          page={pageNumber}
          onChange={(e, page) => handlePageChange(page)}
        />
      </Box>
    </div>
  );
};

export default AppPagination;
