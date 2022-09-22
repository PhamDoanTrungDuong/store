import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import agent from "../../app/api/agent";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { clearBasket } from "../basket/basketSlice";
import { useAppDispatch } from "../../app/store/configureStore";
// import {Buffer} from "buffer"

const MoMoPaymentSucceeded: React.FC = () => {
	const search = useLocation().search;
  // const [exData, setExData] = useState();
	const dispatch = useAppDispatch();
	const message = new URLSearchParams(search).get("message");
	const resultCode = new URLSearchParams(search).get("resultCode");
	const orderId = new URLSearchParams(search).get("orderId");
	const requestId = new URLSearchParams(search).get("requestId");
	const transId = new URLSearchParams(search).get("transId");
	// const extraData = new URLSearchParams(search).get("extraData");

	//   if(extraData !== null){
	//     let buff = new Buffer(extraData, 'base64');
	//     let text = buff.toString('ascii');
	//     console.log(JSON.parse(text))
	//   }

	if (search) {
		if (message === "Successful." && resultCode === "0") {
			const data = {orderId: orderId?.toString(), requestId: requestId?.toString(), transId: transId?.toString()}
			agent.Orders.Momocreate(data).then(() => {
				dispatch(clearBasket());
        			window.history.pushState({}, "", "/returnUrl");
			});
		}
	}

	return (
		<div className="max-w-[1140px] h-[70%] rounded-xl py-16 bg-[#CC2B6F] flex flex-col gap-3 justify-center items-center">
			{message === "Successful." || resultCode === "0" ? (
				<>
					<img src="/images/momo-doll.png" alt="" />
					<h1 className="text-5xl font-extrabold my-3 text-white">
						Thank you - We have received your payment
					</h1>
					<div className="flex justify-center items-center gap-2">
						<button className="mt-2 px-4 py-2 rounded-xl text-indigo-600 bg-white border border-white hover:text-white hover:bg-transparent duration-300">
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
						<button className="mt-2 px-4 py-2 rounded-xl text-indigo-600 bg-white border border-white hover:text-white hover:bg-transparent duration-300">
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
							src="/images/momo.jpeg"
							className="w-[80%]"
							alt=""
						/>
						<h1 className="text-5xl font-extrabold text-white">
							Error!! - Something wrong happend!
						</h1>
						<div className="flex justify-center items-center gap-2">
							<button className="mt-2 px-4 py-2 rounded-xl text-indigo-600 bg-white border border-white hover:text-white hover:bg-transparent duration-300">
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
	);
};

export default MoMoPaymentSucceeded;
