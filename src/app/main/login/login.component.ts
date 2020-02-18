import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { IdentityService } from 'app/shared/services/identity.service';
// import { CognitoCallback, LoggedInCallback, ChallengeParameters } from 'app/shared/services/cognito.service';
import { tenentCognitoCallback, LoggedInCallback, ChallengeParameters } from 'app/shared/services/cognito.tenant.service';
import { MatSnackBar } from '@angular/material';
@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements tenentCognitoCallback, LoggedInCallback, OnInit {
    loginForm: FormGroup;
    errorMessage: string;
    returnUrl: string;
    mfaStep = false;
    mfaData = {
        destination: '',
        callback: null
    };
    snackBarDuration = 3000;
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private identity: IdentityService,
        private _snackBar: MatSnackBar
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.loginForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'device-provisioning';
        this.identity.tenentIsLoggedIn(this);
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            const userdata = this.loginForm.value;
            // this.identity.tenentLogin(userdata.email, userdata.password, this);
            // TODO: Remove after both authentications are common
            this.identity.tenentLogin(userdata.email, userdata.password, this);
        }
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (isLoggedIn) {
            this.router.navigate([this.returnUrl]);
        } else {
            if (message === "Can't retrieve the CurrentUser") {
                message = '';
            } else {
                this.errorMessage = message;
                this._snackBar.open(message, 'Ok', {
                    duration: this.snackBarDuration,
                });
            }
        }
    }

    cognitoCallback(message: string, result: any): void {
        if (message != null) {
            this.errorMessage = message;
            this._snackBar.open(message, 'Ok', {
                duration: this.snackBarDuration,
                verticalPosition: 'top',
                horizontalPosition: 'right',
                panelClass: 'snackError',
            });
        } else {
            this.identity.setToken(result);
            this.router.navigate([this.returnUrl]);
        }
    }

    tenentCognitoCallback(message: string, result: any): void {
        if (message != null) {
            this.errorMessage = message;
            this._snackBar.open('Tenent: ' + message, 'Ok', {
                duration: this.snackBarDuration,
                verticalPosition: 'top',
                horizontalPosition: 'right',
                panelClass:'snackError',
            });
        } else {
            this.identity.tenentSetToken(result);
            this.router.navigate([this.returnUrl]);
        }
    }

    handleMFAStep(challengeName: string, challengeParameters: ChallengeParameters, callback: (confirmationCode: string) => any): void {
        this.errorMessage = 'MFA Enabled';
    }

}
