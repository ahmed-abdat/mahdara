import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import firebaseReducer from './features/fireBase'
import closeNavBar from "./features/closeNavBar";
import Selecte from './features/Selcte'
import Category from './features/category'
import { UserProvider } from "./context";

const store = configureStore({
  reducer: {
    close : closeNavBar,
    firebase: firebaseReducer,
    selecte : Selecte,
    category : Category
  },
});



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider >
      <Provider store={store}>
        <App />
      </Provider>
    </UserProvider>
  </React.StrictMode>
);
