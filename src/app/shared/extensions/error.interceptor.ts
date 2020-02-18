import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IdentityService } from '../services/identity.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private identity: IdentityService, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError((err: any) => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401 || err.status === 403) {
                    // auto logout if 401 response returned from api
                    this.identity.tenentLogout();
                    location.reload(true);
                }
                // else if (err.status != 404) {
                //     this.router.navigate(['/error/', err.status]);
                // }
            }
            
            return throwError(err);
        }));
    }
}