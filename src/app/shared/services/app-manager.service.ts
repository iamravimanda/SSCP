import { Injectable } from '@angular/core';

@Injectable()
export class AppManagerService {
    
    public currentPageTab: PageTab = PageTab.DeviceProvisioning;

}

export enum PageTab {
    DeviceProvisioning = 1,
    DeviceManagement = 2,
    TenantManagement = 3
}
