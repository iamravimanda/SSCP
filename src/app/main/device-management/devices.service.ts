import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject, Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Device } from './devices.model';
import { ApiSettings } from 'app/shared/apiSettings';
import { DeviceManagementFilter } from 'app/shared/Filters/Filters';

@Injectable({
    providedIn: 'root'
})
export class DevicesService {
    onDevicesChanged: BehaviorSubject<any>;
    onSelectedDevicesChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    onDevicesDataChanged: BehaviorSubject<any>;
    onTenantChanged: Subject<any>;

    selectedDevices: string[] = [];
    devices: Device[];
    selectAllChkBox = false;

    constructor(
        private _httpClient: HttpClient,
        private _apiSettings: ApiSettings
    ) {
        this.onSelectedDevicesChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject<any>();
        this.onFilterChanged = new Subject();
        this.onDevicesDataChanged = new BehaviorSubject([]);
        this.onTenantChanged = new Subject();
    }

    toggleSelectedDevice(id): void {
        if (this.selectedDevices.length > 0) {
            const index = this.selectedDevices.indexOf(id);

            if (index !== -1) {
                this.selectedDevices.splice(index, 1);
                this.onSelectedDevicesChanged.next(this.selectedDevices);
                return;
            }
        }

        this.selectedDevices.push(id);
        this.onSelectedDevicesChanged.next(this.selectedDevices);
    }

    toggleSelectAll(selectedDevices): void {
        this.selectDevices(selectedDevices);
    }

    deselectDevices(): void {
        this.selectedDevices = [];
        this.onSelectedDevicesChanged.next(this.selectAllChkBox);
    }

    selectDevices(selectedDevices: any[]): void {
        this.selectedDevices = selectedDevices;
        this.onSelectedDevicesChanged.next(this.selectedDevices);
    }

    fetchDevicesByTenant(filters: DeviceManagementFilter): Observable<any> {
        return this._httpClient.get<any>(this._apiSettings.getDeviceByTenant(filters))
            .pipe(catchError(this.errorHandler));
    }

    fetchDeviceById(deviceID, tenantId): Observable<any> {
        return this._httpClient.get<any>(this._apiSettings.getDevice(deviceID, tenantId))
            .pipe(catchError(this.errorHandler));
    }

    fetchAllRequests(): Observable<any> {
        return this._httpClient.get<any>(this._apiSettings.getRequests()).pipe(catchError(this.errorHandler));
    }

    fetchAllTenants(): Observable<any> {
        return this._httpClient.get<any>(this._apiSettings.getTenants()).pipe(catchError(this.errorHandler));
    }

    private errorHandler(error: any): any {        
        let errorMessage = '';

        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }

        return throwError(errorMessage);
    }
}
