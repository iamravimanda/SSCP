import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { Provision } from 'app/main/device-provisioning/device-provisioning.model';
import { catchError, retry } from 'rxjs/operators';
import { ApiSettings } from 'app/shared/apiSettings';
import { IdentityService } from 'app/shared/services/identity.service';
import { DeviceProvisionFilter, DevicesFilter } from 'app/shared/Filters/Filters';

@Injectable()
export class deviceprovisioningService implements OnInit {
    onProvisionChanged: BehaviorSubject<any>;
    onSelectedContactsChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    onSelectedChanged: Subject<any>;
    onDateFilter: Subject<any>;
    onProvisionsDataChanged: BehaviorSubject<any>;

    provisions: Provision[];
    user: any;
    selectedContacts: string[] = [];

    searchText: string;
    filterBy: string;
    token: string;

    ngOnInit(): void {
        this.token = this.identity.getJwtToken()
    }

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private _apiSettings: ApiSettings,
        private identity: IdentityService,
        private router: Router
    ) {
        // Set the defaults
        this.onProvisionChanged = new BehaviorSubject([]);
        this.onSelectedContactsChanged = new BehaviorSubject([]);
        this.onUserDataChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();
        this.onSelectedChanged = new Subject();
        this.onDateFilter = new Subject();
        this.onProvisionsDataChanged = new BehaviorSubject([]);
    }

    headers_object = new HttpHeaders().set("Authorization", "Bearer " + this.identity.getJwtToken());
    httpOptions = { headers: this.headers_object };

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Resolver
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    // resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    //     return new Promise((resolve, reject) => {
    //         Promise.all([
    //             this.fetchAllRequests(),
    //             //this.fetchAllRequests2()
    //         ]).then(() => { resolve(); }, reject);
    //     });
    // }

    /**
     * Fetch all Devices
     */
    fetchAllDevices(filters: DevicesFilter): Observable<any> {
        return this._httpClient.get<any>(this._apiSettings.getDevices(filters)).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Fetch  Device by Id
     */
    fetchDeviceById(requestID): Observable<any> {
        return this._httpClient.get<any>(this._apiSettings.getDevice(requestID)).pipe(
            catchError(this.handleError)
        );
    }

    fetchDevicesByTenant(tenantId): Observable<any> {
        return this._httpClient.get<any>(this._apiSettings.getDeviceByTenant(tenantId)).pipe(
            catchError(this.handleError)
        );
    }

    // fetchAllRequests(): Observable<any> {
    //     return this._httpClient.get<any>(this._apiSettings.getRequests());
    // }

    fetchAllRequests(filters: DeviceProvisionFilter): Observable<any> {
        return this._httpClient.get<any>(this._apiSettings.getRequests(filters)).pipe(
            catchError(this.handleError)
        );
    }

    fetchAllRequestsAndDeviceCount(filters: DeviceProvisionFilter): Observable<any> {
        return this._httpClient.get<any>(this._apiSettings.getRequestnDeviceCount(filters));
    }

    DeleteProvision(Id:string): Observable<any> {
        return this._httpClient.delete<any>(this._apiSettings.deleteProvision(Id)).pipe(
            catchError(this.handleError)
        );
    }
    deleteProvisionRequestDevice(provisionId:string,deviceId:string): Observable<any> {
        return this._httpClient.delete<any>(this._apiSettings.deletePRDevice(provisionId, deviceId)).pipe(
            catchError(this.handleError)
        );
    }

    handleError(error) {       
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.error}`;
        }

        return throwError(errorMessage);
    }
    // fetchAllRequests2(): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         this._httpClient.get(this._apiSettings.getRequests())
    //             .subscribe((response: any) => {
    //                 this.provisions = response.data.requests;
    //                 this.onProvisionsDataChanged.next(this.provisions);
    //                 resolve(this.provisions);
    //             }, reject);
    //     });
    // }
}
