import { setStateBasket } from "./basketSlice";
import { useAppSelector, useAppDispatch } from "../../app/store/configureStore";
import { BasketItem } from "../../app/interfaces/IBasket";
import { useEffect } from "react";
import BasketTableItem from "./BasketTableItem";

interface IProps {
	items: BasketItem[];
	isBasket?: boolean;
}

const BasketTable: React.FC<IProps> = ({ items, isBasket = true }) => {
	const { status } = useAppSelector((state) => state.basket);
	const dispatch = useAppDispatch();
	console.log(items)

	useEffect(() => {
		if (status === "addSuccess") dispatch(setStateBasket());
	}, [dispatch, status]);

	return (
		<table className="max-w-[400px] sm:max-w-[500px] md:max-w-[600px]">
			<thead>
				<tr>
					<th align="left" className="px-5 md:px-20 pb-5">
						Product
					</th>
					{/* <th align="center" className="px-5 md:px-10 pb-5">
						Variations
					</th> */}
					<th align="center" className="px-5 md:px-10 pb-5">
						Price
					</th>
					<th align="center" className="px-5 md:px-10 pb-5">
						Quantity
					</th>
					<th align="center" className="px-5 md:px-10 pb-5">
						Subtotal
					</th>
					{isBasket && <th align="right"></th>}
				</tr>
			</thead>
			<tbody>
				{items.map((item, idx) => (
					<tr key={item.productId}>
						<BasketTableItem item={item} isBasket={isBasket} />
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default BasketTable;
