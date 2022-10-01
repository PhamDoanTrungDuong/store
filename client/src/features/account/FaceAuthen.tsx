//@ts-nocheck
import React from "react";
import useFaceAuthen from "../../app/hooks/useFaceAuthen";

const FaceAuthen: React.FC = () => {

   const { faceRegistration, faceSignIn } = useFaceAuthen();

	return (
		<div className="my-5 p-5">
			<button className="c-btn" onClick={faceRegistration}>
				Face Authen Register
			</button>
			<button className="c-btn" onClick={faceSignIn}>
				Face Login
			</button>
		</div>
	);
};

export default FaceAuthen;
