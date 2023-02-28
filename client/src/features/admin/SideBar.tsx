import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
	RiBarChartBoxFill,
	RiTableFill,
	RiAccountCircleFill,
	RiPriceTag3Fill,
	RiCouponLine,
	RiChat3Line,
} from "react-icons/ri";
import { TbSlideshow, TbDiscount } from "react-icons/tb";
import { SiGooglecolab } from "react-icons/si";
import { MdManageAccounts, MdInsertComment, MdOutlineCardGiftcard, MdOutlineColorLens, MdOutlinePhotoSizeSelectSmall } from "react-icons/md";
import { useAppSelector, useAppDispatch } from "../../app/store/configureStore";
import { fetchNotifies, setNotifyLoad } from "./adminSlice";
import agent from "../../app/api/agent";

const SideBar: React.FC = () => {
	const { notifies, loadNotify } = useAppSelector((state) => state.admin);
	const dispatch = useAppDispatch();
	const [open, setOpen] = useState(true);

	useEffect(() => {
		loadNotify ? dispatch(fetchNotifies()) : dispatch(fetchNotifies());
	}, [dispatch, loadNotify]);

	const handleCheckNotify = (notify: string) => {
		agent.Admin.adminCheckNotify(notify).then(() => {
			dispatch(setNotifyLoad());
		});
	};

	const Menus = [
		{
			id: 0,
			title: "Inventory",
			to: "/inventory",
			icon: <RiBarChartBoxFill size={30} className="rounded-lg fill-[#637381]" />,
		},
		{
			id: 0,
			title: "Color",
			to: "/admin-color",
			icon: <MdOutlineColorLens size={30} className="rounded-lg fill-[#637381]" />,
		},
		{
			id: 0,
			title: "Size",
			to: "/admin-size",
			icon: <MdOutlinePhotoSizeSelectSmall size={30} className="rounded-lg fill-[#637381]" />,
		},
		{
			id: 1,
			title: "Sales",
			to: "/admin-sales",
			icon: <RiPriceTag3Fill size={30} className="rounded-lg fill-[#637381]" />,
		},
		{
			id: 2,
			title: "Categories",
			to: "/admin-categories",
			icon: <RiTableFill size={30} className="rounded-lg fill-[#637381]" />,
		},
		{
			id: 3,
			title: "Members",
			to: "/admin-members",
			icon: (
				<RiAccountCircleFill
					size={30}
					className="rounded-lg fill-[#637381]"
				/>
			),
		},
		{
			id: 4,
			title: "Messenger",
			to: "/admin-messenger",
			icon: <RiChat3Line size={30} className="rounded-lg fill-[#637381]" />,
		},
		{
			id: 5,
			title: "Role",
			to: "/admin-role",
			icon: <MdManageAccounts size={30} className="rounded-lg fill-[#637381]" />,
		},
		{
			id: 6,
			title: "Comments",
			to: "/admin-comments",
			icon: <MdInsertComment size={30} className="rounded-lg fill-[#637381]" />,
		},
		{
			id: 7,
			title: "Orders",
			to: "/admin-orders",
			icon: (
				<MdOutlineCardGiftcard
					size={30}
					className="rounded-lg fill-[#637381]"
				/>
			),
		},
		{
			id: 8,
			title: "Slider",
			to: "/admin-sliders",
			icon: <TbSlideshow size={30} className="rounded-lg" />,
		},
		{
			id: 9,
			title: "Partner",
			to: "/admin-partners",
			icon: <SiGooglecolab size={30} className="rounded-lg" />,
		},
		{
			id: 10,
			title: "Discount Banner",
			to: "/admin-discountBanner",
			icon: <TbDiscount size={30} className="rounded-lg" />,
		},
		{
			id: 11,
			title: "Voucher",
			to: "/admin-vouchers",
			icon: <RiCouponLine size={30} className="rounded-lg" />,
		},
	];
	return (
		<div
			className={` ${
				open ? "w-64" : "w-[105px]"
			} bg-[#F9FAFB] h-screen overflow-y-scroll overflow-x-hidden z-50 p-5 pt-8 relative duration-300 border border-r-gray-300`}>
			<img
				src="/images/control.png"
				className={`absolute cursor-pointer -right-1 top-9 w-8 border-2 border-gray-200 rounded-full z-50 ${
					!open && "rotate-180"
				}`}
				onClick={() => setOpen(!open)}
			/>

			<div className="flex gap-x-4 items-center">
				<img
					src="/images/logo2.png"
					className={`cursor-pointer duration-500 ${
						open && "rotate-[360deg]"
					}`}
				/>
				<Link to="/">
					<h1
						className={`text-indigo-600 origin-left font-bold italic text-3xl duration-200 ${
							!open && "scale-0"
						}`}>
						STORE.
					</h1>
				</Link>
			</div>
			<ul className="pt-12">
				{Menus.map((Menu, index) => (
					<NavLink
						to={Menu.to}
						key={index}
						className={({ isActive }) => {
							return `flex rounded-lg p-3 cursor-pointer ${
								isActive ? "bg-blue-300/40" : ""
							} hover:bg-gray-300/60 duration-100 text-[#637381] my-1 text-sm group`;
						}}>
						{({ isActive }) => (
							<li
								className="flex w-full items-center gap-x-4 "
								onClick={() =>
									handleCheckNotify(
										Menu.title ===
											"Orders"
											? "Order"
											: Menu.title ===
											  "Comments"
											? "Comment"
											: Menu.title ===
											  "Members"
											? "Member"
											: Menu.title ===
											  "Messenger"
											? "Messenger"
											: ""
									)
								}>
								{Menu.icon}
								<span
									className={`${
										!open && "hidden"
									} origin-left text-[#637381]  ${
										isActive
											? "text-sky-600"
											: ""
									} duration-200`}>
									{Menu.title}
								</span>
								<div
									className={`relative ${
										Array.isArray(
											notifies
										) &&
										notifies?.find(
											(
												item: any
											) =>
												(Menu.title ===
													"Orders" &&
													item.orderNotify ===
														true) ||
												(Menu.title ===
													"Comments" &&
													item.commentNotify ===
														true) ||
												(Menu.title ===
													"Members" &&
													item.memberNotify ===
														true) ||
												(Menu.title ===
													"Messenger" &&
													item.messengerNotify ===
														true)
										)
											? "flex"
											: "hidden"
									}`}>
									<div className="animate-ping inline-flex absolute -top-3 right-3 w-[10px] h-[10px] bg-red-600 rounded-full dark:border-gray-900"></div>
									<div className="inline-flex relative -top-3 right-3 w-[10px] h-[10px] bg-red-600 rounded-full dark:border-gray-900"></div>
								</div>
							</li>
						)}
					</NavLink>
				))}
			</ul>
		</div>
	);
};

export default SideBar;
