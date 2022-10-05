import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { LoginValues, User } from "../../app/api";
import { RootState } from "../../app/store";

type AuthState = {
  user: User | null;
  attempt: number;
};

const initialState: AuthState = {
  user: null,
  attempt: 0
};

export const login = createAsyncThunk<User, LoginValues>(
  "auth/login",
  async (data, thunkAPI) => {
    const response = await api.login(data);
    return response.data;
  }
);

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(login.rejected, (state) => {
      state.user = null;
    });
  }
});

export default slice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
