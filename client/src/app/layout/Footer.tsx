import React from "react";
import { AiOutlineInstagram } from "react-icons/ai";
import { Link } from "react-router-dom";
import { FaFacebookF, FaGithub, FaTiktok, FaTwitter, FaStripe } from "react-icons/fa";

const Footer: React.FC = () => {
	return (
		<div className="rounded-div mt-8 pt-8 text-primary">
			<div className="grid md:grid-cols-2">
				<div className="flex justify-evenly w-full uppercase">
					<div>
						<h2 className="font-bold">Support</h2>
						<ul>
							<li className="text-sm py-2">
								Help Center
							</li>
							<li className="text-sm py-2">Contact Us</li>
							<li className="text-sm py-2">API Status</li>
							<li className="text-sm py-2">
								Documentation
							</li>
						</ul>
					</div>
					<div>
						<h2 className="font-bold">Info</h2>
						<ul>
							<li className="text-sm py-2">About Us</li>
							<li className="text-sm py-2">Careers</li>
							<li className="text-sm py-2">Invest</li>
							<li className="text-sm py-2">Legal</li>
						</ul>
					</div>
					<div>
						<h2 className="font-bold">Payments</h2>
						<ul className="flex flex-col justify-between items-center gap-2">
							<li>
								<FaStripe size={40} className="fill-indigo-600 p-0"/>
							</li>
						<li className="rounded-md overflow-hidden">
								<svg viewBox="6.7169296377637995 5.309796557160162 81.4130703622362 74.62020344283985" xmlns="http://www.w3.org/2000/svg" width="35" height="35"><rect fill="#a50064" height="87" rx="12.06" width="96"/><path d="M71 7.07c-9.45 0-17.11 7.36-17.11 16.43S61.57 39.93 71 39.93s17.13-7.36 17.13-16.43S80.47 7.07 71 7.07zm0 23.44a7.14 7.14 0 0 1-7.27-7 7.28 7.28 0 0 1 14.54 0 7.14 7.14 0 0 1-7.27 7zm-22-11.1V40h-9.88V19.31a2.9 2.9 0 0 0-5.8 0V40h-9.84V19.31a2.9 2.9 0 0 0-5.8 0V40H7.87V19.41A12.62 12.62 0 0 1 20.72 7.07a13.11 13.11 0 0 1 7.7 2.48 13.14 13.14 0 0 1 7.69-2.48A12.63 12.63 0 0 1 49 19.41zM71 47c-9.45 0-17.11 7.35-17.11 16.43S61.57 79.89 71 79.89s17.11-7.35 17.11-16.42S80.47 47 71 47zm0 23.44a7 7 0 1 1 7.27-7A7.14 7.14 0 0 1 71 70.48zM49 59.38v20.55h-9.88V59.27a2.9 2.9 0 0 0-5.8 0v20.66h-9.84V59.27a2.9 2.9 0 0 0-5.8 0v20.66H7.87V59.38A12.61 12.61 0 0 1 20.72 47a13.17 13.17 0 0 1 7.7 2.47A13.11 13.11 0 0 1 36.11 47 12.62 12.62 0 0 1 49 59.38z" fill="#fff"/></svg>
							</li>
							<li className="text-sm py-2 w-[45px] h-[16px]">
								<img
									src="/images/Visa_Logo.png"
									alt=""
								/>
							</li>
							<li className="text-sm py-2 w-[55px] h-[18px]">
								<img
									src="/images/mastercard.png"
									alt=""
								/>
							</li>
						</ul>
					</div>
				</div>
				<div className="text-right">
					<div className="w-full flex justify-end">
						<div className="w-full md:w-[450px] relative text-left">
							<p className="text-center mt-5 sm:mt-0 sm:text-left text-lg font-medium">
								Sign up for shopping
							</p>
							<div className="py-4">
								<form className="flex justify-between items-center gap-3">
									<div className="w-4/5">
										<input
											className="bg-primary border px-2 py-2 mr-2 shadow-xl w-full rounded-xl focus:outline-none"
											type="email"
											placeholder="Enter your email"
										/>
									</div>
									<div className="w-1/5">
										<Link to="register">
											<button className="bg-indigo-600 border border-indigo-600 text-white px-4 p-2 w-full rounded-xl shadow-xl hover:shadow-2xl my-2 hover:bg-transparent hover:text-indigo-600 duration-200">
												Sign
												up
											</button>
										</Link>
									</div>
								</form>
							</div>
							<div className="flex py-4 justify-between text-accent">
								<span className="hover:text-indigo-600 duration-300 hover:scale-125 cursor-pointer">
									<AiOutlineInstagram
										size={25}
									/>
								</span>
								<span className="hover:text-indigo-600 duration-300 hover:scale-125 cursor-pointer">
									<FaTiktok size={25} />
								</span>
								<span className="hover:text-indigo-600 duration-300 hover:scale-125 cursor-pointer">
									<FaTwitter size={25} />
								</span>
								<span className="hover:text-indigo-600 duration-300 hover:scale-125 cursor-pointer">
									<FaFacebookF size={25} />
								</span>
								<span className="hover:text-indigo-600 duration-300 hover:scale-125 cursor-pointer">
									<FaGithub size={25} />
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<p className="text-center text-lg font-bold py-4">
				Welcom to the <span className="text-indigo-600">Store.</span>
			</p>
		</div>
	);
};

export default Footer;
