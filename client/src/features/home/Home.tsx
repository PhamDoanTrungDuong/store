import React, { useEffect } from "react";
import Slider from "react-slick";
import Swal from "sweetalert2";
import useProducts from "../../app/hooks/useProducts";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import About from "../about/About";
import { setStateUser } from "../account/accountSlice";
import { fetchSliders } from "../admin/adminSlice";
import Advertise from "../Advertise/Advertise";
import Contact from "../contact/Contact";
import Partner from "../partner/Partner";
import ProductDiscount from "./ProductDiscount";

const Home: React.FC = () => {
	var settings = {
		dots: true,
		infinite: true,
		speed: 500,
		arrows: false,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
	};
	const { status } = useAppSelector((state) => state.account);
	const { sliders } = useAppSelector((state) => state.admin);

	const dispatch = useAppDispatch();

	const { productDiscount } = useProducts(); 

	useEffect(() => {
		dispatch(fetchSliders());
	}, [dispatch]);

	useEffect(() => {
		if (status === "loginSuccess") {
			Swal.fire({
				icon: "success",
				title: "Your has been Login",
				showConfirmButton: false,
				timer: 1500,
			});
		}
		if (status === "logoutSuccess") {
			Swal.fire({
				icon: "warning",
				title: "Your has been Logout",
				showConfirmButton: false,
				timer: 1500,
			});
		}
		return () => {
			dispatch(setStateUser());
		};
	}, [dispatch, status]);

	return (
		<div className="max-w-[1140px] mx-auto mt-2">
			<div>
				<Slider {...settings}>
					{sliders.map((slider: any, idx:  number) => {
							return (
								<div key={idx}>
									<img
										src={slider.picture}
										alt="hero"
										style={{
											display: "block",
											width: "100%",
											maxHeight: 500,
										}}
									/>
								</div>
							);
						})}
				</Slider>
				<div className="mt-3 text-center p-4">
					{productDiscount.length !== 0 &&
						<ProductDiscount />
					}

					{/* Partner */}
					<Partner />
					<hr />

					{/* About */}
					<About />
					<hr />

					{/* Image */}
					<Advertise />
					<hr />

					{/* Contact */}
					<Contact />
					<hr />
				</div>
			</div>
		</div>
	);
};

export default Home;
