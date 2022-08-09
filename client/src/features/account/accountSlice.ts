import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import agent from "../../app/api/agent";
import { IUser } from "../../app/interfaces/IUser";
import { history } from "../..";
import { toast } from "react-toastify";
import { setBasket } from "../basket/basketSlice";
import { IUsers } from "../../app/interfaces/IUsers";

interface AccountState {
  user: IUser | null;
  users: IUsers[] | null;
  isError: boolean;
  status: string;
}

const initialState: AccountState = {
  user: null,
  users: [],
  isError: true,
  status: 'idle'
};

export const signInUser = createAsyncThunk<IUser, FieldValues>(
  "account/signInUser",
  async (data, thunkAPI) => {
    try {
      const userDto = await agent.Account.login(data);
      const {basket, ...user} = userDto
      if(basket) thunkAPI.dispatch(setBasket(basket));
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const fetchUsers = createAsyncThunk<IUsers[]>(
  "account/fetchUsers",
  async () => {
    try {
        const users = await agent.Admin.getUserRole()
        return users;
    }catch(error: any){
      console.log(error)
    }
  }
)

export const fetchCurrentUser = createAsyncThunk<IUser>(
  "account/fetchCurrentUser",
  async (_, thunkAPI) => {
    thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)));
    try {
      const userDto = await agent.Account.currentUser();
      const {basket, ...user} = userDto
      if(basket) thunkAPI.dispatch(setBasket(basket));
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  },
  {
    condition: () => {
      if (!localStorage.getItem("user")) return false;
    },
  }
);

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    signOut: (state) => {
      state.status = "logoutSuccess"
      state.user = null;
      localStorage.removeItem("user");
      history.push("/");
    },
    setUser: (state, action) => {
      let claims = JSON.parse(atob(action.payload.token.split('.')[1]));
      let roles = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      state.user = {...action.payload, roles: typeof(roles) === 'string' ? [roles] : roles};
    },
    setStateUser: (state) => {
      state.status = "idle"
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchCurrentUser.rejected, (state) => {
      state.user = null;
      localStorage.removeItem('user');
      toast.error('Session expired - please login again');
      history.push('/');
    });

    builder.addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
    });
    builder.addCase(fetchUsers.rejected, (state => {
      state.users = null;
    }));

    builder.addMatcher(
      isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled),
      (state, action) => {
        let claims = JSON.parse(atob(action.payload.token.split('.')[1]));
        let roles = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        state.user = {...action.payload, roles: typeof(roles) === 'string' ? [roles] : roles};
        state.status = "loginSuccess"
        state.isError = false;
      }
    );
    builder.addMatcher(
      isAnyOf(signInUser.rejected),
      (state, action) => {
        throw action.payload;
      }
    );
  },
});

export const { signOut, setUser, setStateUser } = accountSlice.actions;
export default accountSlice.reducer;
