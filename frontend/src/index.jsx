import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import UserAdmin from "./context/UserAdmin";
import ThemeProvider from "./components/student/ThemeProvider"; 


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserAdmin>
     <ThemeProvider>
    <App />
  </ThemeProvider>
    </UserAdmin>
  </React.StrictMode>
);