// Duplicated as-is from CognitoService
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.local';
import * as AWSCognito from 'amazon-cognito-identity-js';
import { CognitoUserSession } from 'amazon-cognito-identity-js';

@Injectable()
export class CognitoTenentService {
    public _REGION = environment.tenant.region;

    public _IDENTITY_POOL_ID = environment.tenant.identityPoolId;
    public _USER_POOL_ID = environment.tenant.userPoolId;
    public _CLIENT_ID = environment.tenant.clientId;

    private TENENT_POOL_DATA: any = {
        REGION: this._REGION,
        COGNITO_POOL: {
            UserPoolId: this._USER_POOL_ID,
            ClientId: this._CLIENT_ID
        }
    };

    private TENENT_POOL_SETTING = this.TENENT_POOL_DATA.COGNITO_POOL;

    TENENT_USER_POOL = new AWSCognito.CognitoUserPool(this.TENENT_POOL_SETTING);

    // tslint:disable-next-line: typedef
    authenticate(email: string, password: string, callback: tenentCognitoCallback) {
        return new Promise((resolved, reject) => {
            const authDetails = new AWSCognito.AuthenticationDetails({
                Username: email,
                Password: password
            });

            const cognitoUser = new AWSCognito.CognitoUser({
                Username: email,
                Pool: this.TENENT_USER_POOL
            });

            cognitoUser.authenticateUser(authDetails, {
                onSuccess: result => {
                    this.onLoginSuccess(callback, result);
                },
                onFailure: err => {
                    this.onLoginError(callback, err);
                },
                newPasswordRequired: userAttributes => {
                    return 'New Password required.';
                }
            });
        });
    }

    private onLoginSuccess = (callback: tenentCognitoCallback, session: CognitoUserSession) => {
        callback.tenentCognitoCallback(null, session);
    }

    private onLoginError = (callback: tenentCognitoCallback, err) => {
        callback.tenentCognitoCallback(err.message, null);
    }

    getCurrentUser() {
        return this.TENENT_USER_POOL.getCurrentUser();
    }

    logout(): void {
        this.TENENT_USER_POOL.getCurrentUser().signOut();
    }

    isValidSession(): boolean {
        if (this.TENENT_USER_POOL.getCurrentUser() != null) {
            this.TENENT_USER_POOL.getCurrentUser().getSession(function (err, session) {
                if (err) {
                    return false;
                } else {
                    if (session.isValid()) {
                        return true;
                    } else {
                        return false;
                    }
                }
            });
        } else {
            return false;
        }
    }

    getAccessToken() {
        return new Promise((resolved, reject) => {
            const cognitoUser = this.TENENT_USER_POOL.getCurrentUser();

            if (cognitoUser != null) {
                cognitoUser.getSession(function (err, result) {
                    if (result.isValid()) {
                        resolved(result.getAccessToken().getJwtToken());
                    } else {
                        reject(err);
                    }
                });
            }
        });
    }

    isAuthenticated(callback: LoggedInCallback) {
        if (callback == null) {
            throw new Error(('UserLoginService: Callback in isAuthenticated() cannot be null'));
        }

        const cognitoUser = this.TENENT_USER_POOL.getCurrentUser();

        if (cognitoUser != null) {
            cognitoUser.getSession(function (err, session) {
                if (err) {
                    callback.isLoggedIn(err, false);
                }
                else {
                    callback.isLoggedIn(err, session.isValid());
                }
            });
        } else {
            callback.isLoggedIn('Can\'t retrieve the CurrentUser', false);
        }
    }
}

export interface tenentCognitoCallback {
    tenentCognitoCallback(message: string, result: any): void;
    handleMFAStep?(challengeName: string, challengeParameters: ChallengeParameters, callback: (confirmationCode: string) => any): void;
}

export interface LoggedInCallback {
    isLoggedIn(message: string, loggedIn: boolean): void;
}

export interface ChallengeParameters {
    CODE_DELIVERY_DELIVERY_MEDIUM: string;
    CODE_DELIVERY_DESTINATION: string;
}

export interface Callback {
    callback(): void;
    callbackWithParam(result: any): void;
}
