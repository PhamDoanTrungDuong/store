import { setStateBasket } from "./basketSlice";
import { useAppSelector, useAppDispatch } from "../../app/store/configureStore";
import { BasketItem } from "../../app/interfaces/IBasket";
import { useEffect } from "react";
import BasketTableItem from "./BasketTableItem";
import { useTranslation } from "react-i18next";
import { IOrder } from "../../app/interfaces/IOrder";

interface IProps {
	order?: IOrder
	items: BasketItem[];
	statusOrder?: string
	isBasket?: boolean;
}

const BasketTable: React.FC<IProps> = ({ items, isBasket = true, statusOrder, order }) => {
	const { t } = useTranslation();

	const { status } = useAppSelector((state) => state.basket);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (status === "addSuccess") dispatch(setStateBasket());
	}, [dispatch, status]);

	return (
		<table className="max-w-[400px] sm:max-w-[500px] md:w-[600px]">
			<thead>
				<tr>
					<th align="left" className="px-5 md:px-20 pb-5">
						{t('Ca_Product')}
					</th>
					<th align="center" className="px-5 md:px-10 pb-5">
						{t('Ca_Var')}
					</th>
					<th align="center" className="px-5 md:px-10 pb-5">
						{t('Ca_Price')}
					</th>
					<th align="center" className="px-5 md:px-10 pb-5">
						{t('Ca_Quantity')}
					</th>
					<th align="center" className="px-5 md:px-10 pb-5">
						{t('Ca_Subtotal')}
					</th>
					{
						statusOrder === "statusOrder" && (
							<th align="center" className="px-5 md:px-10 pb-5">
								
							</th>
						)
					}
					{isBasket && <th align="right"></th>}
				</tr>
			</thead>
			<tbody>
				{items.map((item, idx) => (
					<tr key={item.productId}>
						<BasketTableItem item={item} isBasket={isBasket} statusOrder={statusOrder} order={order} />
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default BasketTable;
