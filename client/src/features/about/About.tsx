import React from "react";
import { useTranslation } from "react-i18next";

const About: React.FC = () => {
	const { t } = useTranslation();
	return (
		<div className="w-full mb-32 mt-10">
			<div className="max-w-[1140px] mx-auto">
				<div className="text-center">
					<h2 className="text-4xl capitalize font-bold">
						{t('Home_Trusted')}
					</h2>
					<p className="text-xl py-6 text-gray-500">
						{t('Home_AtStore')}
					</p>
				</div>
				<div className="grid md:grid-cols-3 gap-3 px-2 text-center">
					<div className="border py-8 rounded-2xl shadow-xl hover:scale-105 duration-300">
						<p className="text-6xl font-bold text-indigo-600">
							100%
						</p>
						<p className="text-gray-400 mt-3 font-medium">
							{t('Home_Completion')}
						</p>
					</div>
					<div className="border py-8 rounded-2xl shadow-xl hover:scale-105 duration-300">
						<p className="text-6xl font-bold text-indigo-600">
							24/7
						</p>
						<p className="text-gray-400 mt-3 font-medium">
							{t('Home_Delivery')}
						</p>
					</div>
					<div className="border py-8 rounded-2xl shadow-xl hover:scale-105 duration-300">
						<p className="text-6xl font-bold text-indigo-600">
							100K
						</p>
						<p className="text-gray-400 mt-3 font-medium">
							{t('Home_Transac')}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default About;
