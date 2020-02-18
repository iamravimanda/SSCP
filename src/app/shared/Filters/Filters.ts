export class DeviceProvisionFilter {
    tenantId: string;
    status: string;
    skip: number;
    take: number;
    toDate: string;
    fromDate: string;
    tenantSCode: any;
    fileName : any;
    dpStatus: string;
}
export class DeviceManagementFilter {
    tenantId: string;
    skip: number;
    take: number;
}
export class DevicesFilter {
    requestId: string;
    skip: number;
    take: number;
    status: string;
}