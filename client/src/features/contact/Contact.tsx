import { Button, ButtonGroup, Typography } from '@mui/material'
import React from 'react'
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import { decreament, increament } from './counterSlice';

const Contact: React.FC = () => {
  const dispatch = useAppDispatch();
  const {data, title} = useAppSelector(state => state.counter);
  return (
     <>
     <Typography variant="h2">
       {title}
     </Typography>

     <Typography variant="h5">
       The data is: {data} 
     </Typography>

    <ButtonGroup>
        <Button onClick={() => dispatch(decreament(1))} variant='contained' color='error'>Decreament</Button>
        <Button onClick={() => dispatch(increament(1))} variant='contained' color='primary'>Increament</Button>
        <Button onClick={() => dispatch(increament(5))} variant='contained' color='secondary'>Increament by 5</Button>
    </ButtonGroup>
   </>
  )
}

export default Contact