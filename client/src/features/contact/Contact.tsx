import { Container, Typography } from "@mui/material";
import React from "react";

const Contact: React.FC = () => {
  return (
    <>
      <Container
        sx={{
          mb: 10,
          mt: 6,
      }}>
        <Typography variant='h3'>
            Contact Page
        </Typography>
      </Container>
    </>
  );
};

export default Contact;
