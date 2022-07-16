import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { FieldValues, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch } from "../../app/store/configureStore";
import { signInUser } from "./accountSlice";
import { history } from "../..";

const Login = () => {
  type FormData = {
    password: string;
    username: string;
  };

  type LocationProps = {
    state: {
      from: Location;
    };
  };

  const dispatch = useAppDispatch();
  const location = useLocation() as unknown as LocationProps;

  const from = location.state?.from?.pathname.toString() || '/catalog';

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = useForm<FormData>({
    mode: "all",
  });
  const submitForm = async (data: FieldValues) => {
    try {
      await dispatch(signInUser(data));
      history.push(from);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container
      component={Paper}
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 3,
        mb: 10,
        mt: 6,
      }}
    >
      <Box
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(submitForm)}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            fullWidth
            label="Username"
            autoFocus
            {...register("username", {
              required: "Username is required",
            })}
            error={!!errors.username}
            helperText={errors?.username?.message}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            type="password"
            {...register("password", {
              required: "Username is required",
            })}
            error={!!errors.password}
            helperText={errors?.password?.message}
          />
          <LoadingButton
            disabled={!isValid}
            loading={isSubmitting}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </LoadingButton>
          <Grid container>
            <Grid item>
              <Link to="/register">{"Don't have an account? Sign Up"}</Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
