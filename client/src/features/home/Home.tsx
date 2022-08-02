import React from "react";
import Slider from "react-slick";

const Home: React.FC = () => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div className="mt-3 max-w-[1140px] mx-auto">
        <Slider {...settings} className="rounded-sm">
          <div>
            <img
              src="/images/hero3.jpg"
              alt="hero"
              style={{ display: "block", width: "100%", maxHeight: 500 }}
            />
          </div>
          <div>
            <img
              src="/images/hero2.jpg"
              alt="hero"
              style={{ display: "block", width: "100%", maxHeight: 500 }}
            />
          </div>
          <div>
            <img
              src="/images/hero1.jpg"
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
