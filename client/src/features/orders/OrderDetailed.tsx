import { Button, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { BasketItem } from "../../app/interfaces/IBasket";
import { IOrder } from "../../app/interfaces/IOrder";
import BasketSumary from "../basket/BasketSumary";
import BasketTable from "../basket/BasketTable";

interface IProps {
    order: IOrder;
    setSelectedOrder: (id: number) => void;
}

const OrderDetailed: React.FC<IProps> = ({ order, setSelectedOrder }) => {
  const subtotal = order.orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0) ?? 0;
    return (
        <>
            <Box display='flex' justifyContent='space-between'>
                <Typography sx={{ p: 2 }} gutterBottom variant='h4'>Order# {order.id} - {order.orderStatus}</Typography>
                <Button onClick={() => setSelectedOrder(0)} sx={{ m: 2 }} size='large' variant='contained'>Back to orders</Button>
            </Box>
            <BasketTable items={order.orderItems as BasketItem[]} isBasket={false} />
            <Grid container>
                <Grid item xs={6} />
                <Grid item xs={6}>
                    <BasketSumary subtotal={subtotal} />
                </Grid>
            </Grid>
        </>
    )
}

export default OrderDetailed