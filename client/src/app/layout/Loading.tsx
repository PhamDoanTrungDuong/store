import { Backdrop, Box, CircularProgress } from '@mui/material'
import React from 'react'

interface IProps {
    message?: string
}

const Loading: React.FC<IProps> = ({ message = 'Loading...' }) => {
  return (
    <div className='h-screen'>
      <Backdrop open={true} invisible={true}>
          <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
              <CircularProgress size={100} color='inherit' />
              {/* <Typography variant='h4' sx={{justifyContent: 'center', position: 'fixed', top: '60%'}}>{ message }</Typography> */}
          </Box>
      </Backdrop>
    </div>
  )
}

export default Loading