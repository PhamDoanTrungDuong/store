import React from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
	return (
		<div className="relative h-screen">
			<img src="/images/404-not-found.png" alt="" />
			<div className="absolute top-[58%] left-[42%] flex justify-center items-center gap-2">
				<button className="c-btn">
					<Link
						to="/"
						className="flex items-center gap-2 font-medium">
						{" "}
						<AiOutlineArrowLeft
							className="font-bold"
							size={20}
						/>{" "}
						Back to Home
					</Link>
				</button>
			</div>
		</div>
	);
};

export default NotFound;
