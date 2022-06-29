import { Alert, AlertTitle, Button, ButtonGroup, Container, List, ListItem, ListItemText, Typography } from "@mui/material";
import React, { useState } from "react";
import agent from "../../app/api/agent";

const Errors: React.FC = () => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const getValidationError = () => {
    agent.TestError.getValidationError()
      .then(() => console.log('should not see this'))
      .catch((error) => {
        setValidationErrors(error);
      });
  };

  return (
    <Container>
      <Typography variant='h2'>
        Errors for testing purposes
      </Typography>
      <ButtonGroup fullWidth>
        <Button
          variant="contained"
          onClick={() => agent.TestError.get400Error()}
        >
          Test 400 Error
        </Button>
        <Button
          variant="contained"
          onClick={() => agent.TestError.get401Error()}
        >
          Test 401 Error
        </Button>
        <Button
          variant="contained"
          onClick={() => agent.TestError.get404Error()}
        >
          Test 404 Error
        </Button>
        <Button
          variant="contained"
          onClick={() => agent.TestError.get500Error()}
        >
          Test 500 Error
        </Button>
        <Button
          variant="contained"
          onClick={getValidationError}
        >
          Test Validation Error
        </Button>
      </ButtonGroup>
      {validationErrors.length > 0 && (
        <Alert severity='error' sx={{marginTop: '5rem'}}>
            <AlertTitle>Validation Errors</AlertTitle>
            <List>
                {validationErrors.map((error, index) => (
                <ListItem key={error}>
                    <ListItemText>{index + 1}. {error}</ListItemText>
                  </ListItem>
                ))}
            </List>
        </Alert>
      )}
    </Container>
  );
};

export default Errors;
