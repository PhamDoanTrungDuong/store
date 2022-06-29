import { Button, Divider, Typography } from '@mui/material'
import { Container } from '@mui/system'
import React from 'react'
import { NavLink } from 'react-router-dom'

const NotFound: React.FC = () => {
  return (
    <Container sx={{height: 20}}>
        <Typography gutterBottom variant='h3'>
            Oops... - we could not find what you are looking for!!
        </Typography>
        <Divider />
        <Button fullWidth component={NavLink} to='/catalog'>
            Back to shop
        </Button>
    </Container>
  )
}

export default NotFound