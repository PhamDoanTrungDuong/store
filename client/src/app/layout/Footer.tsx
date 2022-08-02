import React from "react";
import { AiOutlineInstagram } from "react-icons/ai";
import {
	FaFacebookF,
	FaGithub,
	FaTiktok,
	FaTwitter,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <div className="rounded-div mt-8 pt-8 text-primary">
    <div className="grid md:grid-cols-2">
      <div className="flex justify-evenly w-full uppercase">
        <div>
          <h2 className="font-bold">
            Support
          </h2>
          <ul>
            <li className="text-sm py-2">
              Help Center
            </li>
            <li className="text-sm py-2">
              Contact Us
            </li>
            <li className="text-sm py-2">
              API Status
            </li>
            <li className="text-sm py-2">
              Documentation
            </li>
          </ul>
        </div>
        <div>
          <h2 className="font-bold">
            Info
          </h2>
          <ul>
            <li className="text-sm py-2">
              About Us
            </li>
            <li className="text-sm py-2">
              Careers
            </li>
            <li className="text-sm py-2">
              Invest
            </li>
            <li className="text-sm py-2">
              Legal
            </li>
          </ul>
        </div>
                            <div>
          <h2 className="font-bold">
            Contact
          </h2>
          <ul>
            <li className="text-sm py-2">
              Help Center
            </li>
            <li className="text-sm py-2">
              Contact Us
            </li>
            <li className="text-sm py-2">
              API Status
            </li>
            <li className="text-sm py-2">
              Documentation
            </li>
          </ul>
        </div>
      </div>
      <div className="text-right">
        <div className="w-full flex justify-end">
          <div className="w-full md:w-[300px] py-4 relative">
            <p className="text-left text-lg font-medium">
              Sign up for
              shopping
            </p>
            <div className="py-4">
              <form>
                <input
                  className="bg-primary border border-input p-2 mr-2 w-full shadow-xl rounded-2xl md:w-auto"
                  type="email"
                  placeholder="Enter your email"
                />
                <button className="bg-[#2b6cb0] border border-[#2b6cb0] text-white px-4 p-2 w-full rounded-2xl shadow-xl hover:shadow-2xl md:w-auto my-2 hover:bg-transparent hover:text-[#2b6cb0] duration-200">
                  Sign
                  up
                </button>
              </form>
            </div>
            <div className="flex py-4 justify-between text-accent">
              <AiOutlineInstagram size={25} />
              <FaTiktok size={25} />
              <FaTwitter size={25} />
              <FaFacebookF size={25} />
              <FaGithub size={25} />
            </div>
          </div>
        </div>
      </div>
    </div>
    <p className="text-center py-4">
      Welcom to the Store
    </p>
  </div>
  );
};

export default Footer;
