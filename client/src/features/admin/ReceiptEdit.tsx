import React, { useEffect, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import ReceiptEditTable from "../../app/components/ReceiptEditTable";

interface IProps {
   cancelEditItems: () => void;
   childrenItems: any;
   parentItems: any;
}

const ReceiptEdit: React.FC<IProps> = ({ cancelEditItems, childrenItems, parentItems }) => {

	const { productDetails, loadProductDetails } = useAppSelector((state) => state.admin);

   const filteredProductDetails: any = productDetails.filter((item: any) =>
      parentItems.includes(item.productId)
   );

   const filteredData = filteredProductDetails.map((product: any) => ({
      ...product,
      productDetails: product.productDetails && product.productDetails.filter((detail: any) => childrenItems.includes(detail.id))
    }));
   
	return (
		<div className="mt-24 p-5">
			<div className="flex justify-between items-center mb-8">
				<div className="flex items-center ml-2 mb-5">
					<Link to="/">
						<h1 className="flex items-center gap-1 hover:text-indigo-600 duration-200 text-lg font-rubik ">
							<AiOutlineHome size={20} />
							Home
						</h1>
					</Link>
					<div className="mx-2">
						<IoIosArrowForward size={15} />
					</div>
					<Link to="/">
						<h1 className="flex items-center gap-1 hover:text-indigo-600 duration-200 text-lg font-rubik ">
							<BiCategoryAlt size={20} />
							Receipt Edit
						</h1>
					</Link>
				</div>
				<div>
				</div>
			</div>
			<div className="rounded-div2 p-0">
				<div className="h-[600px] overflow-y-scroll">
						<ReceiptEditTable data={filteredData} cancelEditItems={cancelEditItems}/>
				</div>
			</div>
		</div>
	);
};

export default ReceiptEdit;
