import React from "react";
import ReactDOM from "react-dom/client";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import App from "./app/layout/App";
import "./app/layout/style.css";
import { createBrowserHistory } from "history";
import { Provider } from "react-redux";
import { store } from "./app/store/configureStore";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const history = createBrowserHistory();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <HistoryRouter history={history}>
      <Provider store={store}>
        <App />
      </Provider>
    </HistoryRouter>
  </React.StrictMode>
);
