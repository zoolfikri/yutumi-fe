import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import type { RootState } from "@/store/store";
import ls from "localstorage-slim";

const localstorage: Storage | null = ls.get(
  `${process.env.NEXT_PUBLIC_LOCALSTORAGE_KEY}user_data`,
  {
    decrypt: true,
  }
);

console.log("localstorage", localstorage);

// Define a type for the slice state
export interface CounterState {
  access_token: string;
  refresh_token: string;
  name?: string;
}

// Define the initial state using that type
const initialState: CounterState = {
  access_token: localstorage?.access_token || "",
  refresh_token: localstorage?.refresh_token || "",
  name: localstorage?.name || "",
};

export const userSlice = createSlice({
  name: "user_data",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setUserData: (state, action: PayloadAction<CounterState>) => {
      ls.set(
        `${process.env.NEXT_PUBLIC_LOCALSTORAGE_KEY}user_data`,
        action.payload,
        { encrypt: true }
      );
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
      state.name = action.payload.name;
    },
    clearUserData: (state) => {
      state.access_token = "";
      ls.remove(`${process.env.NEXT_PUBLIC_LOCALSTORAGE_KEY}user_data`);
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.user_data.value;

export default userSlice.reducer;
