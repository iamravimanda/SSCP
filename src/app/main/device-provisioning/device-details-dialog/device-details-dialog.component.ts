import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { deviceprovisioningService } from 'app/main/device-provisioning/device-provisioning.service';
import { Device } from 'app/shared/models/device.model';

@Component({
  selector: 'device-details-dialog',
  templateUrl: './device-details-dialog.component.html',
  styleUrls: ['./device-details-dialog.component.scss']
})
export class DeviceDetailsDialog {

  deviceID: string;
  deviceData: Device;
  // requestsDataTable = new MatTableDataSource(this.deviceData);
  columnsToDisplay = ['DeviceId', 'TenantId', 'DeviceType', 'DeviceGroup', 'Status', 'DataMeter'];
  name:any ;
  deviceStatus: string;

  constructor(
    public dialogRef: MatDialogRef<DeviceDetailsDialog>,
    private _deviceprovisioningService: deviceprovisioningService,
    @Inject(MAT_DIALOG_DATA) data) {
   this.name= data.id.DeviceId
    this.deviceID = data.id.DeviceId;
    this.deviceStatus = data.id.Status;
    // TODO: Need to removed hard coded value
    this._deviceprovisioningService.fetchDeviceById(this.deviceID)
      .subscribe(
        (res: any) => {
          //TO DO//    
          this.deviceData = res.data.telemetry[0];


        }
      );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
