import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { RiBarChartBoxFill, RiTableFill, RiAccountCircleFill, RiPriceTag3Fill } from "react-icons/ri";
import { MdManageAccounts, MdInsertComment, MdOutlineCardGiftcard } from "react-icons/md";

const SideBar: React.FC = () => {
	const [open, setOpen] = useState(true);

	const Menus = [
		{
			id: 0,
			title: "Inventory",
			to: "/inventory",
			icon: (
				<RiBarChartBoxFill
					size={30}
					className="rounded-lg fill-[#637381]"
				/>
			),
		},
		// {
		// 	id: 1,
		// 	title: "Sales",
		// 	to: "/admin-sales",
		// 	icon: (
		// 		<RiPriceTag3Fill
		// 			size={30}
		// 			className="rounded-lg fill-[#637381]"
		// 		/>
		// 	),
		// },
		{ id: 2, title: "Categories", to: "/admin-categories", icon: (
                  <RiTableFill
                        size={30}
                        className="rounded-lg fill-[#637381]"
                  />
            ), },
		{ id: 3, title: "Member", to: "/admin-members", icon: (
                  <RiAccountCircleFill
                        size={30}
                        className="rounded-lg fill-[#637381]"
                  />), },
		{ id: 4, title: "Role", to: "/admin-role", icon: (
                  <MdManageAccounts
                        size={30}
                        className="rounded-lg fill-[#637381]"
                  />), },
		{ id: 5, title: "Comments", to: "/admin-comments", icon: (
                  <MdInsertComment
                        size={30}
                        className="rounded-lg fill-[#637381]"
                  />), },
		{ id: 6, title: "Orders", to: "/admin-orders", icon: (
                  <MdOutlineCardGiftcard
                        size={30}
                        className="rounded-lg fill-[#637381]"
                  />), },
	];
	return (
		<div
			className={` ${
				open ? "w-64" : "w-[90px]"
			} bg-[#F9FAFB] h-screen z-50 p-5 pt-8 relative duration-300 border border-r-gray-300`}>
			<img
				src="/images/control.png"
				className={`absolute cursor-pointer -right-3 top-9 w-8 border-2 border-gray-200 rounded-full z-50 ${
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
					<NavLink to={Menu.to} key={index}
						className={({ isActive }) => {
							return `flex rounded-lg p-3 cursor-pointer ${isActive ? "bg-blue-300/40" : ""} hover:bg-gray-300/60 duration-100 text-[#637381] my-1 text-sm group`}}
					>
						{({ isActive }) =>
							<li
								className="flex items-center gap-x-4 "
							>
									{Menu.icon}
									<span
										className={`${
											!open && "hidden"
										} origin-left text-[#637381]  ${isActive ? "text-sky-600" : ""} duration-200`}>
										{Menu.title}
									</span>
							</li>
						}
					</NavLink>
				))}
			</ul>
		</div>
	);
};

export default SideBar;
