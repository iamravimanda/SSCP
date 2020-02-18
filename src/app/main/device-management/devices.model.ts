import { FuseUtils } from '@fuse/utils';

export class Device {
    deviceId: string;
    tenantId: string;
    deviceType: string;
    deviceGroup: string;
    status: string;
    dataMeter: string;

    constructor(device) {
        this.deviceId = device.deviceId || FuseUtils.generateGUID();
        this.tenantId = device.tenantId || '';
        this.deviceType = device.deviceType || '';
        this.dataMeter = device.dataMeter || '';
        this.status = device.status || '';
        this.deviceGroup = device.deviceGroup || '';
    }
}
