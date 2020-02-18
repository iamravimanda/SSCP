// import { CognitoService, CognitoCallback, LoggedInCallback } from './cognito.service';
import { Injectable } from '@angular/core';
import { CognitoTenentService, tenentCognitoCallback, LoggedInCallback } from './cognito.tenant.service';

@Injectable()
export class IdentityService {

    constructor(private tenentCognito: CognitoTenentService) { }

    setToken(token: any): void {
        if (token != null) {
            localStorage.setItem('auth_token', JSON.stringify(token));
           
        }
    }
    getLocalToken(): any {
        const token = JSON.parse(localStorage.getItem('auth_token'));

        return token;
    }
    removeToken(): void {
        localStorage.removeItem('auth_token');
    }

    getJwtToken(): string {
        const token = this.getLocalToken();
        // .idToken.payload.given_name;
        if (token != null) {
            return token.accessToken.jwtToken;
        }
        else {
            return '';
        }
    }

    getUserName(): string {
        const token = this.getLocalToken();
        // .idToken.payload.given_name;
        if (token != null) {
            return token.idToken.payload.given_name;
        }
        else {
            return '';
        }
    }

    // logout(): boolean {
    //     this.cognito.logout();
    //     this.removeToken();
    //     return true;
    // }

    //#region tenent Identity

    tenentIsLoggedIn(callback: LoggedInCallback) {
        this.tenentCognito.isAuthenticated(callback);
    }

    tenentIsAuthenticated() {
        return this.tenentCognito.isValidSession();
    }

    tenentLogin(username: string, password: string, callback: tenentCognitoCallback): void {
        this.tenentCognito.authenticate(username, password, callback)
            .then(result => {
            }, err => {
              
            });
    }

    tenentSetToken(token: any): void {
        if (token != null) {
            console.log(token.accessToken.jwtToken);
            localStorage.setItem('tenent_auth_token', JSON.stringify(token));          
        }
    }
    tenentGetLocalToken(): any {
        const token = JSON.parse(localStorage.getItem('tenent_auth_token'));

        return token;
    }
    tenentRemoveToken(): void {
        localStorage.removeItem('tenent_auth_token');
    }

    tenentGetJwtToken(): string {
        const token = this.tenentGetLocalToken();
        // .idToken.payload.given_name;
        if (token != null) {
            return token.accessToken.jwtToken;
        }
        else {
            return '';
        }
    }

    tenentGetUserName(): string {
        const token = this.tenentGetLocalToken();
        // .idToken.payload.given_name;
        if (token != null) {
            return token.idToken.payload.given_name;
        }
        else {
            return '';
        }
    }

    tenentLogout(): boolean {
        this.tenentCognito.logout();
        this.tenentRemoveToken();
        return true;
    }
    //#endregion
}
