import React from "react";
import Slider from "react-slick";
import Swal from "sweetalert2";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setStateUser } from "../account/accountSlice";

const Home: React.FC = () => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const { status } = useAppSelector((state) => state.account);
  const dispatch = useAppDispatch()
  if(status === "loginSuccess"){
    Swal.fire({
      icon: 'success',
      title: 'Your has been Login',
      showConfirmButton: false,
      timer: 1500
    });
    dispatch(setStateUser());
  };
  if(status === "logoutSuccess"){
    Swal.fire({
      icon: 'warning',
      title: 'Your has been Logout',
      showConfirmButton: false,
      timer: 1500
    });
    dispatch(setStateUser());
  };
  return (
    <div className="mt-5 max-w-[1140px] mx-auto">
        <Slider {...settings} className="rounded-sm">
          <div>
            <img
              src="/images/banner1.jpg"
              alt="hero"
              style={{ display: "block", width: "100%", maxHeight: 500 }}
            />
          </div>
          <div>
            <img
              src="/images/banner2.jpg"
              alt="hero"
              style={{ display: "block", width: "100%", maxHeight: 500 }}
            />
          </div>
          <div>
            <img
              src="/images/banner3.jpg"
              alt="hero"
              style={{ display: "block", width: "100%", maxHeight: 500 }}
            />
          </div>
        </Slider>
        <div className="rounded-div mt-3 h-screen text-center p-4">
         <h1>Welcom to the Store.</h1>
        </div>
    </div>
  );
};

export default Home;
