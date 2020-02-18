import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IdentityService } from '../services/identity.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private identity: IdentityService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const url = request.url;
        let currentUser: string, currentTenent: string, tenantid:string;
        // if (url.includes('tenants')) {
        //     currentUser = this.identity.tenentGetJwtToken();
        //     currentTenent = localStorage.getItem('managementSelectedTenent') || '';
        // } else {
            currentUser = this.identity.tenentGetJwtToken();
            //currentTenent = localStorage.getItem('managementSelectedTenent') || '';
          //  tenantid='ColumbianBrew';

        // }

        //
        if (currentUser) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser}`,
                   // 'x-tenant-id': currentTenent
                   // 'tenantId':tenantid
                }
            });
        }

        return next.handle(request);
    }
}