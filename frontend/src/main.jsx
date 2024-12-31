import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { UserContextProvider } from "./context/UserContext.jsx";
import { CourseContextProvider } from "./context/CourseContext.jsx";
import { AssignmentContextProvider } from "./context/AssignmentContext.jsx";

export const server = "http://localhost:3001";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserContextProvider>
      <CourseContextProvider>
        <AssignmentContextProvider>
          <App />
        </AssignmentContextProvider>
      </CourseContextProvider>
    </UserContextProvider>
  </React.StrictMode>
);
