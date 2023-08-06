import React, { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { AiOutlineHome } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import ShippingAddressForm from "./ShippingAddressForm";
import { useTranslation } from "react-i18next";

const ShippingAddress: React.FC = () => {
	const { t } = useTranslation();

	const [addresses, setAddresses] = useState<any>([]);
	const [editMode, setEditMode] = useState(false);
	const [selectedAddress, setSelectedAddress] = useState<any>(undefined);

	useEffect(() => {
		if (editMode) {
			agent.Account.userAddresses().then((res) => {
				setAddresses(res);
			});
		} else {
			agent.Account.userAddresses().then((res) => {
				setAddresses(res);
			});
		}
	}, [editMode]);

	function handleSelectAddress(address: any) {
		setSelectedAddress(address);
		setEditMode(true);
	}

	function cancelEdit() {
		if (selectedAddress) setSelectedAddress(undefined);
		setEditMode(false);
	}

	if (editMode)
		return <ShippingAddressForm address={selectedAddress} cancelEdit={cancelEdit} />;

	return (
		<div className="my-5 p-5 h-[1000px]">
			<div className="flex items-center ml-2 mt-3 my-4">
				<Link to="/">
					<h1 className="flex items-center gap-1 hover:text-indigo-600 duration-200 text-lg font-rubik ">
						<AiOutlineHome size={20} />
						{t('Ship_Home')}
					</h1>
				</Link>
				<div className="mx-2">
					<IoIosArrowForward size={15} />
				</div>
				<Link to="/catalog">
					<h1 className="flex items-center gap-1 hover:text-indigo-600 duration-200 text-lg font-rubik ">
						<BiCategoryAlt size={20} />
						{t('Ship_ShipAddr')}
					</h1>
				</Link>
			</div>
			<div className="flex justify-end py-4">
				<button
					onClick={() => setEditMode(true)}
					className="border text-white px-6 py-1 border-indigo-600 bg-indigo-600 text-lg rounded-lg hover:text-indigo-600 hover:bg-transparent duration-200 ease-in-out ">
					{t('Ship_Add')}
				</button>
			</div>
			{addresses.length === 0 ? (
				<h1>{t('Ship_None')}</h1>
			) : (
				<>
					<div className="max-h-[800px] overflow-y-scroll">
						{addresses.map((item: any) => {
							return (
								<div
									onClick={() =>
										handleSelectAddress(
											item
										)
									}
									key={item.id}
									className={`flex flex-col gap-5 my-3 p-4 border rounded-xl hover:border-gray-600 duration-100 cursor-pointer border-gray-300 `}>
									<p>
										<span className="text-lg font-bold">
										{t('Ship_FullName')}
										</span>
										: {item.fullName}
									</p>
									<p>
										<span className="text-lg font-bold">
										{t('Ship_PN')}
										</span>
										: {item.phoneNumber}
									</p>
									<p>
										<span className="text-lg font-bold">
										{t('Ship_Addr1')}
										</span>
										: {item.address1}
									</p>
									<p>
										<span className="text-lg font-bold">
										{t('Ship_Addr2')}
										</span>
										: {item.address2}
									</p>
								</div>
							);
						})}
					</div>
				</>
			)}
		</div>
	);
};

export default ShippingAddress;
