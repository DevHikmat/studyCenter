import { createRoot } from "react-dom/client";
import "@ant-design/v5-patch-for-react-19";
import "./styles/global.css";
import App from "./App";
import "antd/dist/reset.css";
import { Provider } from "react-redux";
import { store } from "./store";


createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
      <App />
  </Provider>
);
