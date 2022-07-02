import { createContext, PropsWithChildren, useContext, useState } from "react";
import { IBasket } from "../interfaces/IBasket";

interface StoreContextValue {
    basket: IBasket | null;
    setBasket: (basket: IBasket) => void;
    removeItem: (productId: number, quantity: number) => void;
}

export const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function useStoreContext() {
    const context = useContext(StoreContext);

    if(context === undefined){
        throw Error('Oops... - we do not seem to ve inside the provider');
    }

    return context;
}

export function StoreProvider({children}: PropsWithChildren<any>){
    const [basket, setBasket] = useState<IBasket | null>(null);

    function removeItem(productId: number, quantity: number){
        if(!basket) return;
        const items = [...basket.items];
        const itemIndex = items.findIndex(i => i.productId === productId);
        if(itemIndex >= 0) {
            items[itemIndex].quantity -= quantity;
            if(items[itemIndex].quantity === 0) items.splice(itemIndex, 1);
            setBasket(prevState => {
                return {...prevState!, items}
            })
        }
    }

    return (
        <StoreContext.Provider value={{basket, setBasket, removeItem}}>
            {children}
        </StoreContext.Provider>
    )
}
