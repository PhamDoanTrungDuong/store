import { RootState } from "./../../app/store/configureStore";
import { createAsyncThunk, createEntityAdapter, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import agent from "../../app/api/agent";
import { IUser, MemberParams } from "../../app/interfaces/IUser";
import { history } from "../..";
import { toast } from "react-toastify";
import { setBasket } from "../basket/basketSlice";
import { IUsers } from "../../app/interfaces/IUsers";
import { IPagination } from "../../app/interfaces/IPagination";
import {
	GoogleAuthProvider,
	signInWithPopup,
} from "firebase/auth";
import { auth } from '../../app/firebase/firebase';

const memberAdapter = createEntityAdapter<IUser>();

interface AccountState {
	membersLoaded: boolean;
	user: IUser | null;
	users: IUsers[] | null;
	isError: boolean;
	accountState: boolean
	status: string;
	count: number;
	memberParams: MemberParams;
	pagination: IPagination | null;
}

const initParams = () => {
	return {
		pageNumber: 1,
		pageSize: 6,
	};
};


export const googleSignIn = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
}

export const signInUser = createAsyncThunk<IUser, FieldValues>(
	"account/signInUser",
	async (data, thunkAPI) => {
		try {
			const userDto = await agent.Account.login(data);
			const { basket, ...user } = userDto;
			if (basket) thunkAPI.dispatch(setBasket(basket));
			localStorage.setItem("user", JSON.stringify(user));
			return user;
		} catch (error: any) {
			return thunkAPI.rejectWithValue({ error: error.data });
		}
	}
);

export const fetchUsers = createAsyncThunk<IUsers[]>("account/fetchUsers", async () => {
	try {
		const users = await agent.Admin.getUserRole();
		return users;
	} catch (error: any) {
		console.log(error);
	}
});

export const fetchCurrentUser = createAsyncThunk<IUser>(
	"account/fetchCurrentUser",
	async (_, thunkAPI) => {
		thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem("user")!)));
		try {
			const userDto = await agent.Account.currentUser();
			const { basket, ...user } = userDto;
			if (basket) thunkAPI.dispatch(setBasket(basket));
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

const getAxiosParams = (memberParams: MemberParams) => {
	const params = new URLSearchParams();
	params.append("pageNumber", memberParams.pageNumber.toString());
	params.append("pageSize", memberParams.pageSize.toString());
	if(memberParams.searchTerm) params.append('searchTerm', memberParams.searchTerm);
	return params;
};

export const fetchMembersAsync = createAsyncThunk<IUser[], void, { state: RootState }>(
	"account/fetchMembersAsync",
	async (_, thunkAPI) => {
		const params = getAxiosParams(thunkAPI.getState().account.memberParams);
		try {
			const response = await agent.Admin.getMembers(params);
			thunkAPI.dispatch(setPagination(response.pagination));
			return response.items;
		} catch (error: any) {
			return thunkAPI.rejectWithValue({ error: error.data });
		}
	}
);

export const fetchMemberCount = createAsyncThunk<number>("order/fetchMemberCount", async () => {
	try {
		const members = await agent.Statistisc.getMemberCount();
		return members;
	} catch (error) {
		console.log(error);
	}
});

export const accountSlice = createSlice({
	name: "account",
	initialState: memberAdapter.getInitialState<AccountState>({
		membersLoaded: false,
		user: null,
		users: [],
		isError: true,
		accountState: false,
		status: "idle",
		count: 0,
		memberParams: initParams(),
		pagination: null,
	}),
	reducers: {
		signOut: (state) => {
			state.status = "logoutSuccess";
			state.user = null;
			localStorage.removeItem("user");
			history.push("/");
		},
		changePwd: (state) => {
			state.status = "changePwdSuccess";
		},
		setUser: (state, action) => {
			let claims = JSON.parse(atob(action.payload.token.split(".")[1]));
			let roles =
				claims[
					"http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
				];
			state.user = {
				...action.payload,
				roles: typeof roles === "string" ? [roles] : roles,
			};
		},
		setStateUser: (state) => {
			state.status = "idle";
		},
		setRoleState: (state) => {
			state.accountState = !state.accountState;
		},
		setPagination: (state, action) => {
			state.pagination = action.payload;
		},
		setPageNumber: (state, action) => {
			state.membersLoaded = false;
			state.memberParams = { ...state.memberParams, ...action.payload };
		},
		setMemberParams: (state, action) => {
			state.membersLoaded = false;
			state.memberParams = {...state.memberParams, ...action.payload, pageNumber: 1};
		},
		setMember: (state, action) => {
			memberAdapter.upsertOne(state, action.payload);
			state.membersLoaded = false;
		},
		removeMember: (state, action) => {
			memberAdapter.removeOne(state, action.payload);
			state.membersLoaded = false;
		},
	},
	extraReducers(builder) {
		builder.addCase(fetchCurrentUser.rejected, (state) => {
			state.user = null;
			localStorage.removeItem("user");
			toast.error("Session expired - please login again");
			history.push("/");
		});

		builder.addCase(fetchMembersAsync.pending, (state) => {
			state.status = "pendingFetchingMember";
		});
		builder.addCase(fetchMembersAsync.fulfilled, (state, action) => {
			memberAdapter.setAll(state, action.payload);
			state.status = "idle";
			state.membersLoaded = true;
		});
		builder.addCase(fetchMembersAsync.rejected, (state) => {
			state.status = "pendingFetchingMember";
		});

		builder.addCase(fetchUsers.fulfilled, (state, action) => {
			state.users = action.payload;
		});
		builder.addCase(fetchUsers.rejected, (state) => {
			state.users = null;
		});
		builder.addCase(fetchMemberCount.fulfilled, (state, action) => {
			state.count = action.payload;
		});
		builder.addCase(signInUser.pending, (state) => {
			state.status = "loginSuccess";
		});

		builder.addMatcher(
			isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled),
			(state, action) => {
				// console.log(action.payload)
				let claims = JSON.parse(atob(action.payload.token.split(".")[1]));
				let roles =
					claims[
						"http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
					];
				state.user = {
					...action.payload,
					roles: typeof roles === "string" ? [roles] : roles,
				};
				state.isError = false;
			}
		);
		builder.addMatcher(isAnyOf(signInUser.rejected), (state, action) => {
			throw action.payload;
		});
	},
});

export const {
	signOut,
	setUser,
	setStateUser,
	setPagination,
	setPageNumber,
	setMember,
	removeMember,
	changePwd,
	setMemberParams,
	setRoleState
} = accountSlice.actions;
export const membersSelector = memberAdapter.getSelectors((state: RootState) => state.account);
export default accountSlice.reducer;
