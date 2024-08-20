import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { useSelector, TypedUseSelectorHook } from "react-redux";

import ls from "localstorage-slim";

type state = {
  sidebarShow: boolean;
  sidebarUnfoldable: boolean;
  asideShow: boolean;
  theme: string;
};

const initialState: state = {
  sidebarShow: true,
  sidebarUnfoldable: false,
  asideShow: false,
  theme: "default",
};

const userData: Object = {
  access_token: "",
  refresh_token: "",
  name: "",
};

type args = { type?: string; [key: string]: any };

const changeState = (state = initialState, { type, ...rest }: args) => {
  switch (type) {
    case "set":
      return { ...state, ...rest };
    case "setUserData":
      console.log("rest", rest.userData);
      ls.set("yutumi--userData", rest.userData);
      return { ...state, ...rest };
    default:
      return { ...state, userData: userData };
  }
};

export function makeStore() {
  return configureStore({
    reducer: changeState,
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export default store;

// https://react-redux.js.org/using-react-redux/static-typing#typing-the-useselector-hook
export const useTypedSelector: TypedUseSelectorHook<state> = useSelector;
