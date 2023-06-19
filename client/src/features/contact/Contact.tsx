import React from "react";
import { MdOutlineTravelExplore } from "react-icons/md";
import { RiCustomerService2Line } from "react-icons/ri";
import { AiOutlinePhone } from "react-icons/ai";
import { useTranslation } from "react-i18next";

const Contact: React.FC = () => {
	const { t } = useTranslation();
	return (
		<div className="lg:col-span-2 flex flex-col justify-evenly my-20 max-w-[1130px] mx-auto">
			<div>
				<h2 className="text-4xl capitalize font-bold">
					{t('Home_MakeThings')}
				</h2>
				<p className="text-xl py-6 text-gray-500">
					{t('Home_Contact')}
				</p>
			</div>
			<div className="grid sm:grid-cols-3 gap-8 py-4">
				<div className="flex flex-col lg:flex-row items-center text-center md:text-left">
					<button className="p-3 bg-gradient-to-r from-[#5651e5] to-[#709dff] text-white rounded-md hover:scale-105 duration-300">
						<RiCustomerService2Line size={50} />
					</button>
					<div className="p-4">
						<h3 className="py-2 text-xl font-bold">
							{t('Home_Leading')}
						</h3>
						<p>{t('Home_AllInclusive')}</p>
					</div>
				</div>
				<div className="flex flex-col lg:flex-row items-center text-center md:text-left">
					<button className="p-3 bg-gradient-to-r from-[#5651e5] to-[#709dff] text-white rounded-md hover:scale-105 duration-300">
						<AiOutlinePhone size={50} />
					</button>
					<div className="p-4">
						<h3 className="py-2 text-xl font-bold">
							{t('Home_PhoneNumber')}
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
							{t('Home_Around')}
						</h3>
						<p>{t('Home_AllInclusive')}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Contact;
