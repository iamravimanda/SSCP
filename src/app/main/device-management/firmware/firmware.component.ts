import { Component, OnInit, ViewChild, ElementRef, Type, Inject } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityService } from 'app/shared/services/identity.service';
import { LoggedInCallback } from 'app/shared/services/cognito.tenant.service';
import { TenantList } from 'app/shared/models/tenant.model';
import { MatSort, MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { Subject, Observable } from 'rxjs';

import { FormControl } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { concatAll, startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-firmware',
  templateUrl: './firmware.component.html',
  styleUrls: ['./firmware.component.scss']
})
export class FirmwareComponent implements LoggedInCallback, OnInit {

  user: any;
  columnsToDisplay = ['ReleaseName', 'Version', 'DeviceType', 'ReleaseDate', 'buttons'];
  firware: any[];
  firwareData = new MatTableDataSource(this.firware);

  constructor(public dialog: MatDialog, public router: Router, ) { }

  isLoggedIn(message: string, isLoggedIn: boolean): void {
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.firwareData = new MatTableDataSource(this.firware);
    // this.firwareData.paginator = this.paginator;
  }

  openCreateFirmwareDialog(): void {
    const dialogRef = this.dialog.open(CreateFirmwareDialog, {
      width: '350px',
      data: { id: 1256561 },
      panelClass: 'colored-dialog-panal'
    });

    dialogRef.afterClosed().subscribe(result => {
     
    });
  }

}

@Component({
  selector: 'firmware-dialog',
  templateUrl: 'firmware-dialog.html',
})
export class CreateFirmwareDialog {

  constructor(
    public dialogRef: MatDialogRef<CreateFirmwareDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onCloseClick(): void {
    this.dialogRef.close();
  }

}