import React, { useState, useEffect, useContext } from "react";
import createAuth0Client, {
  RedirectLoginOptions,
  Auth0Client,
} from "@auth0/auth0-spa-js";

export interface IAuth0User {
  nickname?: string;
  name: string;
  picture: string; // URL for the user's pucture
  updated_at: string;
  email: string;
  email_verified: boolean;
  sub: string;
}

const DEFAULT_REDIRECT_CALLBACK = (appState?: { targetUrl: string }) => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

const DEFAULT_USER: IAuth0User = {
  name: "",
  picture: "", // URL for the user's pucture
  updated_at: "",
  email: "",
  email_verified: false,
  sub: "",
};

/**
 * Fetches the user from Auth0
 */
async function resolveCurrentUser(
  auth0Client: Auth0Client
): Promise<IAuth0User> {
  return await auth0Client.getUser();
}

interface IAuthContext {
  isAuthenticated: boolean;
  isProcessing: boolean;
  user: IAuth0User;
  handleRedirectCallback: () => void;
  loginWithRedirect: (options: RedirectLoginOptions) => void;
  getTokenSilently: (scope?: string) => Promise<string>;
  logout: () => void;
}
export const AuthContext = React.createContext<IAuthContext>({
  isAuthenticated: false,
  isProcessing: false,
  user: DEFAULT_USER,
  // tslint:disable-next-line:no-empty
  handleRedirectCallback: () => {},
  // tslint:disable-next-line:no-empty
  loginWithRedirect: (options: RedirectLoginOptions) => {},
  getTokenSilently: () => Promise.resolve(""),
  // tslint:disable-next-line:no-empty
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  client_id,
  domain,
  audience,
}: {
  children: React.ReactNode;
  onRedirectCallback?: (args: any) => void;
  client_id: string;
  domain: string;
  audience: string;
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<IAuth0User>(DEFAULT_USER);
  const [auth0Client, setAuth0] = useState<Auth0Client>();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client({
        domain,
        client_id,
        audience,
      });
      setAuth0(auth0FromHook);

      if (window.location.search.includes("code=")) {
        const { appState } = await auth0FromHook.handleRedirectCallback();
        onRedirectCallback(appState);
      }

      const authenticated = await auth0FromHook.isAuthenticated();

      setIsAuthenticated(authenticated);

      if (authenticated) {
        const currentUser = await resolveCurrentUser(auth0FromHook);
        setUser(currentUser);
      }

      setIsProcessing(false);
    };
    initAuth0();
    // eslint-disable-next-line
  }, []);

  const handleRedirectCallback = async () => {
    if (auth0Client) {
      setIsProcessing(true);
      const currentUser = await resolveCurrentUser(auth0Client);
      setIsProcessing(false);
      setIsAuthenticated(true);
      setUser(currentUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isProcessing,
        handleRedirectCallback,
        loginWithRedirect: (options: RedirectLoginOptions) => {
          if (!auth0Client) {
            throw new Error("Auth0 not initialized");
          }
          auth0Client.loginWithRedirect(options);
        },
        getTokenSilently: () => {
          if (!auth0Client) {
            return Promise.reject("Auth0 not initialized");
          }
          return auth0Client.getTokenSilently();
        },
        logout: () => {
          if (!auth0Client) {
            throw new Error("Auth0 not initialized");
          }
          auth0Client.logout({ returnTo: `${window.location.origin}` });
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
