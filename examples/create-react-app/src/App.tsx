import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { AuthProvider, useAuth } from "../../../.";

// Modify these values with your own configuration
const domain = "tenant.auth0.com"; // Your tenant
const client_id = "..."; // Auth0 SPA audience
const audience = "api"; // The Auth0 API

const LoginButton = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth();
  return (
    <button
      onClick={() => {
        if (isAuthenticated) {
          logout();
        } else {
          loginWithRedirect({
            redirect_uri: window.location.origin,
          });
        }
      }}
    >
      {isAuthenticated ? "Log Out" : "Log In"}
    </button>
  );
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <AuthProvider domain={domain} client_id={client_id} audience={audience}>
          <LoginButton />
        </AuthProvider>
      </header>
    </div>
  );
}

export default App;
