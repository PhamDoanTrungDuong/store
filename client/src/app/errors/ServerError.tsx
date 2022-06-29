import { Paper, Typography } from '@mui/material'
import { Container } from '@mui/system'
import React from 'react'

const ServerError: React.FC = () => {
  return (
    <Container component={Paper}>
        <Typography variant='h5' gutterBottom>
            Server Error
        </Typography>
    </Container>
  )
}

export default ServerError