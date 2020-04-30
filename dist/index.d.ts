import React from "react";
import { RedirectLoginOptions } from "@auth0/auth0-spa-js";
export interface IAuth0User {
    nickname?: string;
    name: string;
    picture: string;
    updated_at: string;
    email: string;
    email_verified: boolean;
    sub: string;
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
export declare const AuthContext: React.Context<IAuthContext>;
export declare const useAuth: () => IAuthContext;
export declare const AuthProvider: ({ children, onRedirectCallback, client_id, domain, audience, }: {
    children: React.ReactNode;
    onRedirectCallback?: ((args: any) => void) | undefined;
    client_id: string;
    domain: string;
    audience: string;
}) => JSX.Element;
export {};
