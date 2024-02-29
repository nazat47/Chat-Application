import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./main.scss";
import App from "./App";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { positions, transitions, Provider as AlertProvider } from "react-alert";
import alertTemplate from "react-alert-template-basic";

const options = {
  timeout: 3000,
  positions: positions.BOTTOM_CENTER,
  transitions: transitions.SCALE,
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AlertProvider template={alertTemplate} {...options}>
        <App />
      </AlertProvider>
    </PersistGate>
  </Provider>
);
