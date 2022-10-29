import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import agent from "../../app/api/agent";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { clearBasket } from "../basket/basketSlice";
import { useAppDispatch } from "../../app/store/configureStore";

const PaymentConfirm = () => {
  const result = useLocation().search;
  // const [exData, setExData] = useState();

	const dispatch = useAppDispatch();
	const orderId = new URLSearchParams(result).get("vnp_TxnRef");
	const vnpayTranId = new URLSearchParams(result).get("vnp_TransactionNo");
	const vnp_ResponseCode = new URLSearchParams(result).get("vnp_ResponseCode");
	const vnp_SecureHash = new URLSearchParams(result).get("vnp_SecureHash");

	if (result && vnp_ResponseCode === "00") {
		agent.Orders.Vnpaycreate().then(() => {
			dispatch(clearBasket());
			window.history.pushState({}, "", "/paymentConfirm");
		});
	}


  return (
    <div className="max-w-[1140px] h-[70%] rounded-xl py-16 bg-white flex flex-col gap-3 justify-center items-center">
			{vnp_ResponseCode === "00" ? (
				<>
					<img src="/images/vnpay.png" alt="" />
					<div className='text-3xl my-3 font-medium'>
						<h3>Payment to invoice: #{orderId} | Trading Id: #{vnpayTranId}</h3>
					</div>
					<h1 className="text-5xl font-extrabold my-3 text-black">
					 <span className='text-[#005BAA]'>Thank you -</span> <span className='text-[#ED1C24]'>We have received your payment</span>
					</h1>
					<div className="flex justify-center items-center gap-2">
						<button className="mt-2 px-4 py-2 rounded-xl text-white bg-[#005BAA] border border-[#005BAA] hover:text-[#005BAA] hover:bg-transparent duration-300">
							<Link
								to="/catalog"
								className="flex items-center gap-2 font-medium">
								{" "}
								<AiOutlineArrowLeft
									className="font-bold"
									size={20}
								/>{" "}
								Back to Catalog
							</Link>
						</button>
						<button className="mt-2 px-4 py-2 rounded-xl text-white bg-[#ED1C24] border border-[#ED1C24] hover:text-[#ED1C24] hover:bg-transparent duration-300">
							<Link
								to="/orders"
								className="flex items-center gap-2 font-medium">
								Go to your Order{" "}
								<AiOutlineArrowRight
									className="font-bold"
									size={20}
								/>
							</Link>
						</button>
					</div>
				</>
			) : (
				<>
					<>
						<img
							src="/images/vnpay.png"
							className="w-[30%]"
							alt=""
						/>
						<div className='text-3xl my-3 font-medium'>
							<h3>An error occurred during invoice processing: #{orderId} | Trading code: #{vnpayTranId} | Error code: {vnp_ResponseCode}</h3>
						</div>
						<h1 className="text-5xl font-extrabold text-white">
							<span className="text-[#ED1C24]"> Error!! - </span> <span className="text-[#005BAA]">Something wrong happend!</span>
						</h1>
						<div className="flex justify-center items-center gap-2">
						<button className="mt-2 px-4 py-2 rounded-xl text-white bg-[#005BAA] border border-[#005BAA] hover:text-[#005BAA] hover:bg-transparent duration-300">
							<Link
								to="/catalog"
								className="flex items-center gap-2 font-medium">
								{" "}
								<AiOutlineArrowLeft
									className="font-bold"
									size={20}
								/>{" "}
								Back to Catalog
							</Link>
						</button>
						</div>
					</>
				</>
			)}
		</div>
  )
}

export default PaymentConfirm