import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiSettings } from 'app/shared/apiSettings';
import { Tenant } from 'app/shared/models/tenant.model';
import { PageEvent } from '@angular/material';

@Injectable()
export class TenantsService implements Resolve<any>
{
    tenants: any[];
    onTenantsChanged: BehaviorSubject<any>;
    pageIndex = 0;
    onSearchTextChanged: Subject<any>;

    constructor(private _httpClient: HttpClient, private _apiSettings: ApiSettings) {
        // Set the defaults
        this.onTenantsChanged = new BehaviorSubject({});
        this.onSearchTextChanged = new Subject<any>();
    }

    /**
     * Resolver
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.fetchAllTenants()
            ]).then(() => { resolve(); }, reject);
        });
    }

    fetchAllTenants(): Observable<any> {
        return this._httpClient.get<any>(this._apiSettings.getTenants()).pipe(catchError(this.handleError));
    }

    createTenant(tenant: Tenant): Observable<any> {
        return this._httpClient.post<any>(this._apiSettings.createTenant(), tenant)
            .pipe(catchError(this.handleError));
    }

    updateTenant(tenant: Tenant, tenantid: string): any {
        return this._httpClient.put(this._apiSettings.updateTenant(tenantid), tenant)
            .pipe(catchError(this.handleError));
    }

    deleteTenant(tenantID: string): any {
        const url = this._apiSettings.deleteTenant(tenantID);

        return this._httpClient.delete(url).pipe(catchError(this.handleError));
    }

    fetchTenantById(tenantId): any {
        const url = this._apiSettings.getTenant(tenantId);

        return this._httpClient.get(url).pipe(catchError(this.handleError));
    }

    handleError(error): any {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = error.error.error;
        }

        return throwError(errorMessage);
    }

    setPageIndex(idx: number): void {
        this.pageIndex = idx;
    }

    getPageIndex(): number {
        return this.pageIndex;
    }
}
