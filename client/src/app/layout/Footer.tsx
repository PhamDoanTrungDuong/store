import React from "react";
import { AiOutlineInstagram } from "react-icons/ai";
import { Link } from "react-router-dom";
import { FaFacebookF, FaGithub, FaTiktok, FaTwitter } from "react-icons/fa";

const Footer: React.FC = () => {
	return (
		<div className="rounded-div mt-8 pt-8 text-primary">
			<div className="grid md:grid-cols-2">
				<div className="flex justify-evenly w-full uppercase">
					<div>
						<h2 className="font-bold">
							Support
						</h2>
						<ul>
							<li className="text-sm py-2">
								Help Center
							</li>
							<li className="text-sm py-2">
								Contact Us
							</li>
							<li className="text-sm py-2">
								API Status
							</li>
							<li className="text-sm py-2">
								Documentation
							</li>
						</ul>
					</div>
					<div>
						<h2 className="font-bold">
							Info
						</h2>
						<ul>
							<li className="text-sm py-2">
								About Us
							</li>
							<li className="text-sm py-2">
								Careers
							</li>
							<li className="text-sm py-2">
								Invest
							</li>
							<li className="text-sm py-2">
								Legal
							</li>
						</ul>
					</div>
					<div>
						<h2 className="font-bold">
							Contact
						</h2>
						<ul>
							<li className="text-sm py-2">
								Help Center
							</li>
							<li className="text-sm py-2">
								Contact Us
							</li>
							<li className="text-sm py-2">
								API Status
							</li>
							<li className="text-sm py-2">
								Documentation
							</li>
						</ul>
					</div>
				</div>
				<div className="text-right">
					<div className="w-full flex justify-end">
						<div className="w-full md:w-[400px] relative text-left">
							<p className="text-left text-lg font-medium">
								Sign up for
								shopping
							</p>
							<div className="py-4">
								<form className="flex justify-between items-center">
									<div className="w-[300px]">
										<input
											className="bg-primary border px-2 py-2 mr-2 shadow-xl w-full rounded-xl focus:outline-none"
											type="email"
											placeholder="Enter your email"
										/>
									</div>
									<div>
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
										size={
											25
										}
									/>
								</span>
								<span className="hover:text-indigo-600 duration-300 hover:scale-125 cursor-pointer">
									<FaTiktok
										size={
											25
										}
									/>
								</span>
								<span className="hover:text-indigo-600 duration-300 hover:scale-125 cursor-pointer">
									<FaTwitter
										size={
											25
										}
									/>
								</span>
								<span className="hover:text-indigo-600 duration-300 hover:scale-125 cursor-pointer">
									<FaFacebookF
										size={
											25
										}
									/>
								</span>
								<span className="hover:text-indigo-600 duration-300 hover:scale-125 cursor-pointer">
									<FaGithub
										size={
											25
										}
									/>
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<p className="text-center py-4">Welcom to the Store</p>
		</div>
	);
};

export default Footer;
