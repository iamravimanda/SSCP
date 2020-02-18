import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.local';
import * as AWSCognito from 'amazon-cognito-identity-js';
import { CognitoUserSession } from 'amazon-cognito-identity-js';

@Injectable()
export class CognitoService {
    public _REGION = environment.region;

    public _IDENTITY_POOL_ID = environment.identityPoolId;
    public _USER_POOL_ID = environment.userPoolId;
    public _CLIENT_ID = environment.clientId;

    private _POOL_DATA: any = {
        REGION: this._REGION,
        COGNITO_POOL: {
            UserPoolId: this._USER_POOL_ID,
            ClientId: this._CLIENT_ID
        }
    };

    private POOL_SETTING = this._POOL_DATA.COGNITO_POOL;

    _USER_POOL = new AWSCognito.CognitoUserPool(this.POOL_SETTING);

    // tslint:disable-next-line: typedef
    authenticate(email: string, password: string, callback: CognitoCallback) {
        return new Promise((resolved, reject) => {
            const authDetails = new AWSCognito.AuthenticationDetails({
                Username: email,
                Password: password
            });

            const cognitoUser = new AWSCognito.CognitoUser({
                Username: email,
                Pool: this._USER_POOL
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

    private onLoginSuccess = (callback: CognitoCallback, session: CognitoUserSession) => {
        callback.cognitoCallback(null, session);
    }

    private onLoginError = (callback: CognitoCallback, err) => {
        callback.cognitoCallback(err.message, null);
    }

    getCurrentUser() {
        return this._USER_POOL.getCurrentUser();
    }
    
    logout(): void {
        this._USER_POOL.getCurrentUser().signOut();
    }

    isValidSession(): boolean {
        if (this._USER_POOL.getCurrentUser() != null) {
            this._USER_POOL.getCurrentUser().getSession(function (err, session) {
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
            const cognitoUser = this._USER_POOL.getCurrentUser();

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

        const cognitoUser = this._USER_POOL.getCurrentUser();

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

export interface CognitoCallback {
    cognitoCallback(message: string, result: any): void;
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
