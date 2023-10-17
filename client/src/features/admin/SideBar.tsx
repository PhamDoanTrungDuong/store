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
import { BsReceipt } from "react-icons/bs";
import { MdManageAccounts, MdInsertComment, MdOutlineCardGiftcard, MdOutlineColorLens, MdOutlinePhotoSizeSelectSmall } from "react-icons/md";
import { useAppSelector, useAppDispatch } from "../../app/store/configureStore";
import { fetchNotifies, setNotifyLoad } from "./adminSlice";
import agent from "../../app/api/agent";

const SideBar: React.FC = () => {
	const { user } = useAppSelector((state) => state.account);
	const { notifies, loadNotify } = useAppSelector((state) => state.admin);
	const dispatch = useAppDispatch();
	const [open, setOpen] = useState(true);
	const [openDropdown, setOpenDropdown] = useState<any>(null);

	useEffect(() => {
		loadNotify ? dispatch(fetchNotifies()) : dispatch(fetchNotifies());
	}, [dispatch, loadNotify]);

	const handleCheckNotify = (notify: string) => {
		agent.Admin.adminCheckNotify(notify).then(() => {
			dispatch(setNotifyLoad());
		});
	};

	// const Menus = [
	// 	{
	// 		id: 0,
	// 		title: "Inventory",
	// 		to: "/inventory",
	// 		roles: "Admin",
	// 		icon: <RiBarChartBoxFill size={30} className="rounded-lg fill-[#637381]" />,
	// 	},
	// 	{
	// 		id: 0,
	// 		title: "Color",
	// 		to: "/admin-color",
	// 		roles: "Admin",
	// 		icon: <MdOutlineColorLens size={30} className="rounded-lg fill-[#637381]" />,
	// 	},
	// 	{
	// 		id: 0,
	// 		title: "Size",
	// 		to: "/admin-size",
	// 		roles: "Admin",
	// 		icon: <MdOutlinePhotoSizeSelectSmall size={30} className="rounded-lg fill-[#637381]" />,
	// 	},
	// 	{
	// 		id: 1,
	// 		title: "Sales",
	// 		to: "/admin-sales",
	// 		roles: "Admin",
	// 		icon: <RiPriceTag3Fill size={30} className="rounded-lg fill-[#637381]" />,
	// 	},
	// 	{
	// 		id: 2,
	// 		title: "Categories",
	// 		to: "/admin-categories",
	// 		roles: "Admin",
	// 		icon: <RiTableFill size={30} className="rounded-lg fill-[#637381]" />,
	// 	},
	// 	{
	// 		id: 3,
	// 		title: "Members",
	// 		to: "/admin-members",
	// 		roles: "Admin",
	// 		icon: (
	// 			<RiAccountCircleFill
	// 				size={30}
	// 				className="rounded-lg fill-[#637381]"
	// 			/>
	// 		),
	// 	},
	// 	{
	// 		id: 4,
	// 		title: "Messenger",
	// 		to: "/admin-messenger",
	// 		roles: ["Admin", "Moderator"],
	// 		icon: <RiChat3Line size={30} className="rounded-lg fill-[#637381]" />,
	// 	},
	// 	{
	// 		id: 5,
	// 		title: "Role",
	// 		to: "/admin-role",
	// 		roles: "Admin",
	// 		icon: <MdManageAccounts size={30} className="rounded-lg fill-[#637381]" />,
	// 	},
	// 	{
	// 		id: 6,
	// 		title: "Comments",
	// 		to: "/admin-comments",
	// 		roles: ["Admin", "Moderator"],
	// 		icon: <MdInsertComment size={30} className="rounded-lg fill-[#637381]" />,
	// 	},
	// 	{
	// 		id: 7,
	// 		title: "Orders",
	// 		to: "/admin-orders",
	// 		roles: ["Admin", "Moderator"],
	// 		icon: (
	// 			<MdOutlineCardGiftcard
	// 				size={30}
	// 				className="rounded-lg fill-[#637381]"
	// 			/>
	// 		),
	// 	},
	// 	{
	// 		id: 8,
	// 		title: "Slider",
	// 		to: "/admin-sliders",
	// 		roles: ["Admin", "Moderator"],
	// 		icon: <TbSlideshow size={30} className="rounded-lg" />,
	// 	},
	// 	{
	// 		id: 9,
	// 		title: "Partner",
	// 		to: "/admin-partners",
	// 		icon: <SiGooglecolab size={30} className="rounded-lg" />,
	// 	},
	// 	{
	// 		id: 10,
	// 		title: "Discount Banner",
	// 		to: "/admin-discountBanner",
	// 		roles: ["Admin", "Moderator"],
	// 		icon: <TbDiscount size={30} className="rounded-lg" />,
	// 	},
	// 	{
	// 		id: 11,
	// 		title: "Voucher",
	// 		to: "/admin-vouchers",
	// 		roles: ["Admin", "Moderator"],
	// 		icon: <RiCouponLine size={30} className="rounded-lg" />,
	// 	},
	// 	{
	// 		id: 12,
	// 		title: "Receipt",
	// 		to: "/admin-receipt",
	// 		roles: ["Admin", "Moderator"],
	// 		icon: <BsReceipt size={30} className="rounded-lg" />,
	// 	},
	// ];

	const Menus = [
    {
      title: "Inventory and Sales",
      items: [
        {
          id: 0,
          title: "Inventory",
          to: "/inventory",
          roles: "Admin",
          icon: <RiBarChartBoxFill size={30} className="rounded-lg fill-[#637381]" />,
        },
        {
          id: 1,
          title: "Sales",
          to: "/admin-sales",
          roles: "Admin",
          icon: <RiPriceTag3Fill size={30} className="rounded-lg fill-[#637381]" />,
        },
        {
          id: 11,
          title: "Voucher",
          to: "/admin-vouchers",
          roles: ["Admin", "Moderator"],
          icon: <RiCouponLine size={30} className="rounded-lg" />,
        },
      ],
    },
    {
      title: "Product Management",
      items: [
        {
          id: 13,
          title: "Color",
          to: "/admin-color",
          roles: "Admin",
          icon: <MdOutlineColorLens size={30} className="rounded-lg fill-[#637381]" />,
        },
        {
          id: 14,
          title: "Size",
          to: "/admin-size",
          roles: "Admin",
          icon: <MdOutlinePhotoSizeSelectSmall size={30} className="rounded-lg fill-[#637381]" />,
        },
        {
          id: 2,
          title: "Categories",
          to: "/admin-categories",
          roles: "Admin",
          icon: <RiTableFill size={30} className="rounded-lg fill-[#637381]" />,
        },
      ],
    },
    {
      title: "User and Messaging",
      items: [
        {
          id: 3,
          title: "Members",
          to: "/admin-members",
          roles: "Admin",
          icon: <RiAccountCircleFill size={30} className="rounded-lg fill-[#637381]" />,
        },
        {
          id: 5,
          title: "Role",
          to: "/admin-role",
          roles: "Admin",
          icon: <MdManageAccounts size={30} className="rounded-lg fill-[#637381]" />,
        },
        {
          id: 4,
          title: "Messenger",
          to: "/admin-messenger",
          roles: ["Admin", "Moderator"],
          icon: <RiChat3Line size={30} className="rounded-lg fill-[#637381]" />,
        },
        {
          id: 6,
          title: "Comments",
          to: "/admin-comments",
          roles: ["Admin", "Moderator"],
          icon: <MdInsertComment size={30} className="rounded-lg fill-[#637381]" />,
        },
      ],
    },
    {
      title: "Orders and Receipts",
      items: [
        {
          id: 7,
          title: "Orders",
          to: "/admin-orders",
          roles: ["Admin", "Moderator"],
          icon: <MdOutlineCardGiftcard size={30} className="rounded-lg fill-[#637381]" />,
        },
        {
          id: 12,
          title: "Receipt",
          to: "/admin-receipt",
          roles: ["Admin", "Moderator"],
          icon: <BsReceipt size={30} className="rounded-lg" />,
        },
      ],
    },
    {
      title: "Promotions and Partners",
      items: [
        {
          id: 8,
          title: "Slider",
          to: "/admin-sliders",
          roles: ["Admin", "Moderator"],
          icon: <TbSlideshow size={30} className="rounded-lg" />,
        },
        {
          id: 10,
          title: "Discount Banner",
          to: "/admin-discountBanner",
          roles: ["Admin", "Moderator"],
          icon: <TbDiscount size={30} className="rounded-lg" />,
        },
        {
          id: 9,
          title: "Partner",
          to: "/admin-partners",
          icon: <SiGooglecolab size={30} className="rounded-lg" />,
        },
      ],
    },
  ];

	return (
		<div
			className={` ${
				open ? "w-72" : "w-[105px]"
			} bg-[#F9FAFB] h-screen overflow-y-scroll overflow-x-hidden z-50 p-5 pt-8 relative duration-300 border border-r-gray-300`}>
			<img
				src="/images/control.png"
				className={`absolute cursor-pointer right-2 top-9 w-8 border-2 border-gray-200 rounded-full z-50 ${
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
				{
					user?.roles?.includes("Moderator")
					? Menus.map((group, groupIndex) => (
						 <li key={groupIndex} className="my-2 py-2">
							<div
							  className="text-[#637381] text-sm my-2 px-3 cursor-pointer"
							  onClick={() =>
								 setOpenDropdown(group.title === openDropdown ? null : group.title)
							  }
							>
							  {group.title}
							</div>
							<ul
							  className={`${
								 group.title === openDropdown ? "block" : "hidden"
							  }`}
							>
							  {group.items.map((Menu, itemIndex) => (
								 Menu.roles?.includes("Moderator") && (
									<li key={itemIndex} 
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
									}
									>
									  <NavLink
										 to={Menu.to}
										 className={({ isActive }) => {
											return `group flex rounded-lg p-3 cursor-pointer ${
											  isActive ? "bg-blue-300/40" : ""
											} hover:bg-gray-300/60 duration-100 text-[#637381] text-sm`;
										 }}
									  >
										 {Menu.icon}
										 <span
											className={`${
											  !open && "hidden"
											} origin-left duration-200 p-1`}
										 >
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
											<div className="animate-ping inline-flex absolute -top-3 right-1 w-[10px] h-[10px] bg-red-600 rounded-full dark:border-gray-900"></div>
											<div className="inline-flex relative -top-3 right-1 w-[10px] h-[10px] bg-red-600 rounded-full dark:border-gray-900"></div>
										</div>
									  </NavLink>
									</li>
								 )
							  ))}
							</ul>
						 </li>
					  ))
					: Menus.map((group, groupIndex) => (
						<li key={groupIndex} className="my-2 py-2">
						  <div
							 className="text-[#637381] text-lg font-bold my-2 px-3 cursor-pointer hover:text-indigo-600/90 duration-200"
							 onClick={() =>
								setOpenDropdown(group.title === openDropdown ? null : group.title)
							 }
						  >
							 {group.title}
						</div>
						  <ul
							 className={`${
								group.title === openDropdown ? "block" : "hidden"
							 } duration-200 pl-5` }
						  >
							 {group.items.map((Menu, itemIndex) => (
								<li key={itemIndex} 
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
													}
								>
								  <NavLink
									 to={Menu.to}
									 className={({ isActive }) => {
										return `group flex gap-2 rounded-lg p-3 cursor-pointer item-center ${
										  isActive ? "bg-blue-300/40" : ""
										} hover:bg-gray-300/60 duration-100 text-[#637381] text-sm`;
									 }}
								  >
									 {Menu.icon}
									 <span
										className={`${
										  !open && "hidden"
										} origin-left duration-200 p-1`}
									 >
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
								  </NavLink>
								</li>
							 ))}
						  </ul>
						</li>
					))
				}
				{/* {
					user?.roles?.includes("Moderator") ? (
						// Menus.map((Menu, index) => (
						// 	Menu.roles?.includes("Moderator") &&
						// 	<NavLink
						// 		to={Menu.to}
						// 		key={index}
						// 		className={({ isActive }) => {
						// 			return `flex rounded-lg p-3 cursor-pointer ${
						// 				isActive ? "bg-blue-300/40" : ""
						// 			} hover:bg-gray-300/60 duration-100 text-[#637381] my-1 text-sm group`;
						// 		}}>
						// 		{({ isActive }) => (
						// 			<li
						// 				className="flex w-full items-center gap-x-4 "
						// 				onClick={() =>
						// 					handleCheckNotify(
						// 						Menu.title ===
						// 							"Orders"
						// 							? "Order"
						// 							: Menu.title ===
						// 							  "Comments"
						// 							? "Comment"
						// 							: Menu.title ===
						// 							  "Members"
						// 							? "Member"
						// 							: Menu.title ===
						// 							  "Messenger"
						// 							? "Messenger"
						// 							: ""
						// 					)
						// 				}>
						// 				{Menu.icon}
						// 				<span
						// 					className={`${
						// 						!open && "hidden"
						// 					} origin-left text-[#637381]  ${
						// 						isActive
						// 							? "text-sky-600"
						// 							: ""
						// 					} duration-200`}>
						// 					{Menu.title}
						// 				</span>
						// 				<div
						// 					className={`relative ${
						// 						Array.isArray(
						// 							notifies
						// 						) &&
						// 						notifies?.find(
						// 							(
						// 								item: any
						// 							) =>
						// 								(Menu.title ===
						// 									"Orders" &&
						// 									item.orderNotify ===
						// 										true) ||
						// 								(Menu.title ===
						// 									"Comments" &&
						// 									item.commentNotify ===
						// 										true) ||
						// 								(Menu.title ===
						// 									"Members" &&
						// 									item.memberNotify ===
						// 										true) ||
						// 								(Menu.title ===
						// 									"Messenger" &&
						// 									item.messengerNotify ===
						// 										true)
						// 						)
						// 							? "flex"
						// 							: "hidden"
						// 					}`}>
						// 					<div className="animate-ping inline-flex absolute -top-3 right-3 w-[10px] h-[10px] bg-red-600 rounded-full dark:border-gray-900"></div>
						// 					<div className="inline-flex relative -top-3 right-3 w-[10px] h-[10px] bg-red-600 rounded-full dark:border-gray-900"></div>
						// 				</div>
						// 			</li>
						// 		)}
						// 	</NavLink>
						// ))
					) : (		
						// Menus.map((Menu, index) => (
						// 	<NavLink
						// 		to={Menu.to}
						// 		key={index}
						// 		className={({ isActive }) => {
						// 			return `flex rounded-lg p-3 cursor-pointer ${
						// 				isActive ? "bg-blue-300/40" : ""
						// 			} hover:bg-gray-300/60 duration-100 text-[#637381] my-1 text-sm group`;
						// 		}}>
						// 		{({ isActive }) => (
						// 			<li
						// 				className="flex w-full items-center gap-x-4 "
						// 				onClick={() =>
						// 					handleCheckNotify(
						// 						Menu.title ===
						// 							"Orders"
						// 							? "Order"
						// 							: Menu.title ===
						// 							  "Comments"
						// 							? "Comment"
						// 							: Menu.title ===
						// 							  "Members"
						// 							? "Member"
						// 							: Menu.title ===
						// 							  "Messenger"
						// 							? "Messenger"
						// 							: ""
						// 					)
						// 				}>
						// 				{Menu.icon}
						// 				<span
						// 					className={`${
						// 						!open && "hidden"
						// 					} origin-left text-[#637381]  ${
						// 						isActive
						// 							? "text-sky-600"
						// 							: ""
						// 					} duration-200`}>
						// 					{Menu.title}
						// 				</span>
						// 				<div
						// 					className={`relative ${
						// 						Array.isArray(
						// 							notifies
						// 						) &&
						// 						notifies?.find(
						// 							(
						// 								item: any
						// 							) =>
						// 								(Menu.title ===
						// 									"Orders" &&
						// 									item.orderNotify ===
						// 										true) ||
						// 								(Menu.title ===
						// 									"Comments" &&
						// 									item.commentNotify ===
						// 										true) ||
						// 								(Menu.title ===
						// 									"Members" &&
						// 									item.memberNotify ===
						// 										true) ||
						// 								(Menu.title ===
						// 									"Messenger" &&
						// 									item.messengerNotify ===
						// 										true)
						// 						)
						// 							? "flex"
						// 							: "hidden"
						// 					}`}>
						// 					<div className="animate-ping inline-flex absolute -top-3 right-3 w-[10px] h-[10px] bg-red-600 rounded-full dark:border-gray-900"></div>
						// 					<div className="inline-flex relative -top-3 right-3 w-[10px] h-[10px] bg-red-600 rounded-full dark:border-gray-900"></div>
						// 				</div>
						// 			</li>
						// 		)}
						// 	</NavLink>
						// ))
					)
				} */}
			</ul>
		</div>
	);
};

export default SideBar;
