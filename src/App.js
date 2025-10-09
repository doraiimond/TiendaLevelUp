import logo from './logo.svg';
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import RouterConfig from "./routes/RouterConfig";

function App() {
  return (
    <UserProvider>
      <Router>
        <RouterConfig />
      </Router>
    </UserProvider>
  );
}

export default App;
