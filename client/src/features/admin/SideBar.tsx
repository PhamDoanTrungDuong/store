import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RiBarChartBoxFill, RiTableFill, RiAccountCircleFill, RiPriceTag3Fill } from "react-icons/ri";
import { MdManageAccounts, MdInsertComment, MdOutlineCardGiftcard } from "react-icons/md";

const SideBar: React.FC = () => {
	const [open, setOpen] = useState(true);

	const Menus = [
		{
			title: "Inventory",
			to: "/inventory",
			icon: (
				<RiBarChartBoxFill
					size={30}
					className="rounded-lg fill-white group-hover:fill-indigo-600"
				/>
			),
		},
		// {
		// 	title: "Sales",
		// 	to: "/admin-sales",
		// 	icon: (
		// 		<RiPriceTag3Fill
		// 			size={30}
		// 			className="rounded-lg fill-white group-hover:fill-indigo-600"
		// 		/>
		// 	),
		// },
		{ title: "Categories", to: "/admin-categories", icon: (
                  <RiTableFill
                        size={30}
                        className="rounded-lg fill-white group-hover:fill-indigo-600"
                  />
            ), },
		{ title: "Member", to: "/admin-members", icon: (
                  <RiAccountCircleFill
                        size={30}
                        className="rounded-lg fill-white group-hover:fill-indigo-600"
                  />), },
		// { title: "Role", to: "/admin-role", icon: (
      //             <MdManageAccounts
      //                   size={30}
      //                   className="rounded-lg fill-white group-hover:fill-indigo-600"
      //             />), },
		// { title: "Comments", to: "/admin-comments", icon: (
      //             <MdInsertComment
      //                   size={30}
      //                   className="rounded-lg fill-white group-hover:fill-indigo-600"
      //             />), },
		// { title: "Orders", to: "/admin-orders", icon: (
      //             <MdOutlineCardGiftcard
      //                   size={30}
      //                   className="rounded-lg fill-white group-hover:fill-indigo-600"
      //             />), },
	];
	return (
		<div
			className={` ${
				open ? "w-64" : "w-20 "
			} bg-indigo-600 h-screen p-5 pt-8 relative duration-300`}>
			<img
				src="/images/control.png"
				className={`absolute cursor-pointer -right-3 top-9 w-7 border-2 border-indigo-600 rounded-full  ${
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
						className={`text-white origin-left font-bold italic text-3xl duration-200 ${
							!open && "scale-0"
						}`}>
						STORE.
					</h1>
				</Link>
			</div>
			<ul className="pt-6">
				{Menus.map((Menu, index) => (
					<Link to={Menu.to} key={index}>
						<li
							className={`flex rounded-md p-2 cursor-pointer hover:bg-white duration-100 text-white text-sm items-center gap-x-4 my-4 group`}>
							{Menu.icon}
							<span
								className={`${
									!open && "hidden"
								} origin-left duration-200`}>
								{Menu.title}
							</span>
						</li>
					</Link>
				))}
			</ul>
		</div>
	);
};

export default SideBar;
