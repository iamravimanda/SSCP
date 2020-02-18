import { Injectable } from '@angular/core';
import { DeviceProvisionFilter, DeviceManagementFilter, DevicesFilter } from './Filters/Filters';

@Injectable()
export class ApiSettings {

    baseApiUrl = ' https://api.subs-cp-dev.com/'; // 'https://xa9ahunjx9.execute-api.us-east-1.amazonaws.com/dev/v1/';

    public getRequests(filters?: DeviceProvisionFilter): string {
        const params = new Array();
        params.push('skip=' + filters.skip);
        params.push('take=' + filters.take);
        params.push('toDate=' + filters.toDate);
        params.push('fromDate=' + filters.fromDate);

        if (filters.tenantId) {
            params.push('tenantId=' + filters.tenantId);
        }

        if (filters.tenantSCode) {
            params.push('requestId=' + filters.tenantSCode);
        }

        if (filters.fileName) {
            params.push('fileName=' + filters.fileName);
        }

        if (filters.dpStatus) {
            params.push('Status=' + filters.dpStatus);
        }

    


        if (filters.status && filters.status !== 'all') {
            if ((filters.status === 'RequestReceived') || (filters.status === 'RequestProcessing')) {
                params.push('status=RequestReceived');
                params.push('status=RequestProcessing');
            } else {
                params.push('status=' + filters.status);
            }
        }
      
        return this.baseApiUrl + 'dp/v1/dp/management/requests?' + params.join('&');
    }

    public getDevices(filters: DevicesFilter): string {
        const params = new Array();
        params.push('skip=' + filters.skip);
        params.push('take=' + filters.take);

        if (filters.status) {
            params.push('status=' + filters.status);
        }

        return this.baseApiUrl + 'dp/v1/dp/management/requests/' + filters.requestId + '/devices?' + params.join('&');
    }

    public getDeviceByTenant(filters: DeviceManagementFilter): string {
        const params = new Array();
        params.push('skip=' + filters.skip);
        params.push('take=' + filters.take);

        if (filters.tenantId) {
            params.push('tenantId=' + filters.tenantId);
        }

        return this.baseApiUrl + 'telemetry/v1/telemetry/?' + params.join('&');
    }

    public getDevice(deviceID: string, tenantID?: string): string {
        const params = new Array();
        params.push('deviceId=' + deviceID);

        if (tenantID) {
            params.push('tenantId=' + tenantID);
        }

        return this.baseApiUrl + 'telemetry/v1/telemetry/?' + params.join('&');
    }

    public deleteProvision(ProvisionId: string): string {
        return this.baseApiUrl + 'dp/v1/dp/management/requests/' + ProvisionId;
    }

    public deletePRDevice(ProvisionId: string, DeviceId: string): string {
        return this.baseApiUrl + 'dp/management/requests/' + ProvisionId + '/devices/' + DeviceId;
    }

    public getTenants(): string {
       return this.baseApiUrl + 'tenant/v1/tenants?skip=0&take=100';
       // return this.baseApiUrl + 'tenant/v1/tenants';
    }

    public createTenant(): string {
        return this.baseApiUrl + 'tenant/v1/tenants';
    }

    public updateTenant(tenantId: string): string {
        return this.baseApiUrl + 'tenant/v1/tenants/' + tenantId;
    }

    public updateTenantstatus(tenantId: string): string {
        return this.baseApiUrl + 'tenant/v1/tenants/' + tenantId;
    }

    public deleteTenant(tenantId: string): string {
        return this.baseApiUrl + 'tenant/v1/tenants/' + tenantId;
    }

    public getTenant(tenantId: string): string {
        return this.baseApiUrl + 'tenant/v1/tenants/' + tenantId;
    }

    public getRequestnDeviceCount(filters?: DeviceProvisionFilter): string {
        const params = new Array();
        params.push('toDate=' + filters.toDate);
        params.push('fromDate=' + filters.fromDate);

        if (filters.tenantId) {
            params.push('tenantId=' + filters.tenantId);
        }

        if (filters.status && filters.status !== 'all') {
            params.push('status=' + filters.status);
        }

        return this.baseApiUrl + 'dp/v1/dp/management/requests/count?' + params.join('&');
    }
}
