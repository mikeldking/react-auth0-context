# react-auth0-context

React context and hook for Auth0 Authentication using `@auth0/auth0-spa-js`

## Install

```
yarn add react-auth0-context
```

## Setup

Add the AuthProvider at the root of your React app and pass in your Auth0 application info and API identifier (audience)

```typescript
import { AuthProvider } from "react-auth0-context";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider domain={domain} client_id={client_id} audience={audience}>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
```

Add a way to log in

```typescript
import { useAuth } from "react-auth0-context";

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
```

Use the `useAuth` hook to get user info and authentication tokens to talk to your API

```typescript
const { user, getTokenSilently } = useAuth();

async function makeAuthenticatedAPIRequest() {
  const token = await getTokenSilently();
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authentication: `Bearer ${token}`,
    },
    body: data,
  });
  return response.json();
}
```

## How to use with Routing
If you are using something like React Router, you can use `useAuth` to create a private toute

```typescript
import React, { useEffect } from "react";
import { Route, RouteProps } from "react-router-dom";
import { useAuth } from "react-auth0-context";
import { Location } from "history";

interface IPrivateRouteProps extends RouteProps {
  // tslint:disable-next-line:no-any
  component: any;
}

function locationToString(location: Location<any>) {
  const { pathname, search } = location;
  let str = pathname;
  if (search) {
    str += search;
  }
  return str;
}

const PrivateRoute: React.FunctionComponent<IPrivateRouteProps> = (
  routeProps
) => {
  const { component: Component, path, ...rest } = routeProps;
  const { isAuthenticated, loginWithRedirect } = useAuth();

  useEffect(() => {
    const loginFn = async () => {
      if (!isAuthenticated) {
        const targetUrl =
          routeProps.location && locationToString(routeProps.location);
        await loginWithRedirect({
          redirect_uri: window.location.origin,
          appState: { targetUrl },
        });
      }
    };
    loginFn();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [isAuthenticated, loginWithRedirect, path]);
  return isAuthenticated ? (
    <Route path={path} render={(props) => <Component {...props} />} {...rest} />
  ) : null;
};

export default PrivateRoute;
```
