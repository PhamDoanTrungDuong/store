import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchPartners } from "../admin/adminSlice";

const Partner: React.FC = () => {
	const { partners } = useAppSelector((state) => state.admin);
	const dispatch = useAppDispatch();
	useEffect(() => {
		dispatch(fetchPartners);
	}, [dispatch]);
	return (
		<div className="w-full mb-32 mt-10">
			<div className="max-w-[1140px] mx-auto">
				<div className="text-center py-6">
					<h2 className="text-4xl capitalize font-bold">
						Collaboration
					</h2>
				</div>
				<div className="grid md:grid-cols-4 gap-3 px-2 text-center">
					{partners.slice(0, 4).map((item: any) => {
						return (
							<div className="border py-8 rounded-2xl shadow-xl hover:scale-105 duration-300">
								<img
									src={item.picture}
									className="cursor-pointer rounded-lg hover:scale-105 duration-300 h-full w-full object-contain"
									alt=""
                           style={{
                              height: 100,
                           }}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default Partner;
