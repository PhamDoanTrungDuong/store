import React from "react";
import { MdOutlineTravelExplore } from "react-icons/md";
import { RiCustomerService2Line } from "react-icons/ri";
import { AiOutlinePhone } from "react-icons/ai";

const Contact: React.FC = () => {
	return (
		<div className="lg:col-span-2 flex flex-col justify-evenly my-20 max-w-[1130px] mx-auto">
			<div>
				<h2 className="text-4xl capitalize font-bold">
					To make things convenient for site visitors
				</h2>
				<p className="text-xl py-6 text-gray-500">
					The contact us page on Dija Ouija website includes an image
					of her product - in this case, the artist work - to catch
					the eye of site visitors. To the left of an image is a form
					labeled “Contact Me.” Between the light pink, black and
					white used on both the image and the form, the artist,
					Kahdija Murray, has customized the contact page to fit her
					brand colors. Interestingly, the contact us page not only
					includes the standard name, email and message fields, but it
					also includes several social media buttons. Clicking on
					these buttons takes the user directly to Kahdija social
					media pages, providing yet another option for viewing her
					work and getting in touch.
				</p>
			</div>
			<div className="grid sm:grid-cols-3 gap-8 py-4">
				<div className="flex flex-col lg:flex-row items-center text-center md:text-left">
					<button className="p-3 bg-gradient-to-r from-[#5651e5] to-[#709dff] text-white rounded-md hover:scale-105 duration-300">
						<RiCustomerService2Line size={50} />
					</button>
					<div className="p-4">
						<h3 className="py-2 text-xl font-bold">
							LEADING SERVICES
						</h3>
						<p>ALL-INCLUSIVE COMPANY FOR 20 YEARS IN-A-ROW</p>
					</div>
				</div>
				<div className="flex flex-col lg:flex-row items-center text-center md:text-left">
					<button className="p-3 bg-gradient-to-r from-[#5651e5] to-[#709dff] text-white rounded-md hover:scale-105 duration-300">
						<AiOutlinePhone size={50} />
					</button>
					<div className="p-4">
						<h3 className="py-2 text-xl font-bold">
							PHONE NUMBER
						</h3>
						<div>
							<p>
								<span>
									tel: 0312-312-312
									(Ms.Mcgonal)
								</span>
							</p>
							<p>
								<span>tel: 3124-333-432 (Mr.John)</span>
							</p>
						</div>
					</div>
				</div>
				<div className="flex flex-col lg:flex-row items-center text-center md:text-left">
					<button className="p-3 bg-gradient-to-r from-[#5651e5] to-[#709dff] text-white rounded-md hover:scale-105 duration-300">
						<MdOutlineTravelExplore size={50} />
					</button>
					<div className="p-4">
						<h3 className="py-2 text-xl font-bold">
							AROUND THE WORLD
						</h3>
						<p>ALL-INCLUSIVE COMPANY FOR 20 YEARS IN-A-ROW</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Contact;
