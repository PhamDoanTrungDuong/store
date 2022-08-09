import * as React from "react";
import BasketSumary from "../basket/BasketSumary";
import BasketTable from "../basket/BasketTable";
import { useAppSelector } from "../../app/store/configureStore";

const Review: React.FC = () => {
  const { basket } = useAppSelector((state) => state.basket);
  return (
    <>
      <h6 className='text-xl font-medium'>
        Order sumary
      </h6>
      <div className="flex justify-center items-center scrollbar-hide">
        {basket &&
          <BasketTable items={basket.items} isBasket={false}/>
        }
      </div>
        <div className='w-full my-4'>
          <BasketSumary />
        </div>
    </>
  );
};

export default Review;
