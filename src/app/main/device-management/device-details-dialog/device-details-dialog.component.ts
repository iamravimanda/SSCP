import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DevicesService } from 'app/main/device-management/devices.service';
import { Device } from '../devices.model';

@Component({
  selector: 'device-details-dialog',
  templateUrl: './device-details-dialog.component.html',
  styleUrls: ['./device-details-dialog.component.scss']
})
export class DeviceDetailsDialogComponent {

  deviceID: string;
  deviceData: Device;
  name: any;
  deviceStatus: string;
  tenantId:string;

  constructor(
    public dialogRef: MatDialogRef<DeviceDetailsDialogComponent>,
    private _devicesService: DevicesService,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.name = data.deviceData.DeviceId;
    this.deviceID = data.deviceData.DeviceId;
    this.deviceStatus = data.deviceData.HealthStatus;
    this.tenantId = data.deviceData.TenantId;
    this._devicesService.fetchDeviceById(this.deviceID, this.tenantId).subscribe((res: any) => {
      this.deviceData = res.data.telemetry[0];
     
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
