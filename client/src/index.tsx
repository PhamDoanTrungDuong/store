import React from "react";
import ReactDOM from "react-dom/client";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import App from "./app/layout/App";
import "./app/layout/style.css";
import { createBrowserHistory } from "history";
import { StoreProvider } from "./app/context/StoreContext";

export const history = createBrowserHistory();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <HistoryRouter history={history}>
      <StoreProvider>
        <App />
      </StoreProvider>
    </HistoryRouter>
  </React.StrictMode>
);
