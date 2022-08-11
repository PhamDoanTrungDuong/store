import React from "react";

const Advertise: React.FC = () => {
	return (
		<div className="mx-auto text-center py-16 px-4">
			<h1 className="text-4xl capitalize font-bold">All-Product in Store</h1>
			<p className="text-xl py-6 text-gray-500">On the Store's Best Product</p>
			<div className="grid md:grid-cols-5 py-4 gap-4 md:gap-5">
				<img
					src="/images/ad3.jpg"
					className="cursor-pointer hover:scale-105 duration-300 h-full w-full object-cover col-span-2 md:col-span-3 row-span-2 rounded-lg"
					alt=""
				/>
				<div>
					<img
						src="/images/ad4.jpg"
						className="cursor-pointer rounded-lg hover:scale-105 duration-300 h-full w-full object-cover"
						alt=""
					/>
				</div>
				<div>
					<img
						src="/images/ad7.jpg"
						className="cursor-pointer rounded-lg hover:scale-105 duration-300 h-full w-full object-cover"
						alt=""
					/>
				</div>
				<div>
					<img
						src="/images/ad8.jpg"
						className="cursor-pointer rounded-lg hover:scale-105 duration-300 h-full w-full object-cover"
						alt=""
					/>
				</div>
				<div>
					<img
						src="/images/ad2.jpg"
						className="cursor-pointer rounded-lg hover:scale-105 duration-300 h-full w-full object-cover"
						alt=""
					/>
				</div>
			</div>
		</div>
	);
};

export default Advertise;
