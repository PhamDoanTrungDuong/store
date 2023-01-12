import React from 'react'
import { useAppSelector } from '../../app/store/configureStore';
import { currencyFormat } from '../../app/utilities/util';

interface IProps {
    subtotal?: number;
}

const BasketSumary: React.FC<IProps> = ({subtotal}) => {
  const {basket} = useAppSelector(state => state.basket);
  const { selectedVoucher } = useAppSelector((state) => state.admin);

    if (subtotal === undefined)
       subtotal = basket?.items.reduce((sum, item) => sum + (item.quantity * item.salePrice), 0) ?? 0;
       var discount = +selectedVoucher.value;
       var subtotal2 = subtotal - (subtotal * (discount/100));
    const deliveryFee = subtotal > 10000 ? 0 : 500;
    // console.log(subtotal)
    // console.log(subtotal2)
    return (
        <>
            <div className='p-4 border rounded-xl'>
                <h1 className="text-2xl font-medium">
                    Sumary
                </h1>
                <div className='flex my-4 justify-between'>
                    <h1>Subtotal</h1>
                    <p>{currencyFormat(selectedVoucher ? subtotal2 : subtotal)}</p>
                </div>
                <hr />
                <div className='flex my-4 justify-between'>
                    <h1>Delivery fee*</h1>
                    <p>{currencyFormat(deliveryFee)}</p>
                </div>
                <hr />
                <div className='flex mt-8 justify-between text-lg font-bold'>
                    <h1>Total</h1>
                    <p>{currencyFormat((selectedVoucher ? subtotal2 : subtotal) + deliveryFee)}</p>
                </div>
                <hr />
                <div className='flex my-4 justify-between'>
                    <h1><span>*Orders over $100 qualify for free delivery</span></h1>
                </div>
            </div>
        </>
    )
}

export default BasketSumary