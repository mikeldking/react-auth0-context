# react-auth0-context

React context and hook for Auth0 Authentication using `@auth0/auth0-spa-js`

## Install

```
yarn add react-auth0-context
```

## Setup

Add the AuthProvider at the root of your React app and pass in your Auth0 application info and API identifier (audience)

```typescript
<AuthProvider domain={domain} client_id={client_id} audience={audience}>
  <App />
</AuthProvider>
```

Add a way to log in

```typescript
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
