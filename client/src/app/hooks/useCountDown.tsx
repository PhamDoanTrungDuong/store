import { useCallback, useEffect, useState } from "react";

const useCountDown = () => {
	const [countDown, setCountDown] = useState("");

	const timeCountDown = useCallback(() => {
		const timeInterval = setInterval(function () {
			const d = new Date();
			const hours = 24 - d.getHours();
			let min: number | string = 60 - d.getMinutes();
			if ((min + "").length === 1) {
				min = "0" + min;
			}
			let sec: number | string = 60 - d.getSeconds();
			if ((sec + "").length === 1) {
				sec = "0" + sec;
			}

			setCountDown(hours + ":" + min + ":" + sec);
		}, 1000);

		return () => clearInterval(timeInterval);
	}, []);

	useEffect(() => {
		timeCountDown();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return {
            countDown
      };
};

export default useCountDown;
