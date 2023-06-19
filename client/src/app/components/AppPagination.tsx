import { Pagination } from "@mui/material";
import React, { useState } from "react";
import { IPagination } from "../interfaces/IPagination";
import { useTranslation } from "react-i18next";

interface IProps {
  pagination: IPagination;
  onPageChange: (page: number) => void;
}

const AppPagination: React.FC<IProps> = ({ pagination, onPageChange }) => {
  const { t } = useTranslation();

  const { currentPage, totalCount, totalPages, pageSize } = pagination;
  const [pageNumber, setPageNumber] = useState(currentPage);

  const handlePageChange = (page: number) => {
    setPageNumber(page);
    onPageChange(page)
  }
  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="hidden lg:block text-lg">
          {t('Page_Display')} <span className="font-medium">{(currentPage - 1) * pageSize + 1}-
          {currentPage * pageSize > totalCount
            ? totalCount
            : currentPage * pageSize}
            </span> {t('Page_Of')}{" "}
            <span className="font-medium">
              { totalCount}
            </span>
             {" "}{t('Page_Items')}
        </p>
        <Pagination
          size="large"
          count={totalPages}
          page={pageNumber}
          onChange={(e, page) => handlePageChange(page)}
        />
      </div>
    </div>
  );
};

export default AppPagination;
