import { Typography } from "@mui/material";
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
    <section className="mt-3">
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
        <div className="h-[900px] text-center">
          <Typography variant="h1">Welcom to the Store</Typography>
        </div>
    </section>
  );
};

export default Home;
