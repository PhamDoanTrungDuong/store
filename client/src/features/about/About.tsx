import React from "react";

const About: React.FC = () => {
	return (
		<div className="w-full my-32">
			<div className="max-w-[1140px] mx-auto">
				<div className="text-center">
					<h2 className="text-4xl capitalize font-bold">
						Trusted by comsumers across the world
					</h2>
					<p className="text-xl py-6 text-gray-500">
						At STORE., we give you the choice of 100+ degree
						programs and customized career preparation. Star
						professors and pro-level technology. Real-world
						experiences and alumni connections. All so you can
						turn your dream into your reality. Make it here so
						you can make it out there.
					</p>
				</div>
				<div className="grid md:grid-cols-3 gap-3 px-2 text-center">
					<div className="border py-8 rounded-2xl shadow-xl hover:scale-105 duration-300">
						<p className="text-6xl font-bold text-indigo-600">
							100%
						</p>
						<p className="text-gray-400 mt-3 font-medium">
							Completion
						</p>
					</div>
					<div className="border py-8 rounded-2xl shadow-xl hover:scale-105 duration-300">
						<p className="text-6xl font-bold text-indigo-600">
							24/7
						</p>
						<p className="text-gray-400 mt-3 font-medium">
							Delivery
						</p>
					</div>
					<div className="border py-8 rounded-2xl shadow-xl hover:scale-105 duration-300">
						<p className="text-6xl font-bold text-indigo-600">
							100K
						</p>
						<p className="text-gray-400 mt-3 font-medium">
							Transactions
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default About;
