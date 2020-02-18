import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { DevicesService } from '../devices.service';

@Component({
    selector: 'app-selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls: ['./selected-bar.component.scss']
})
export class DevicesSelectedBarComponent implements OnInit, OnDestroy {

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedDevices: boolean;
    isIndeterminate: boolean;
    selectedDevices: string[];

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _deviceService: DevicesService,
        public _matDialog: MatDialog
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this._deviceService.onSelectedDevicesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectDevices => {
                this.selectedDevices = selectDevices;
                setTimeout(() => {
                    this.hasSelectedDevices = selectDevices.length > 0;
                    this.isIndeterminate = (selectDevices.length !== this._deviceService.selectDevices.length && selectDevices.length > 0);
                }, 0);
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    selectAll(): void {
        // this._deviceService.selectDevices();
    }

    deselectAll(): void {
        this._deviceService.deselectDevices();
    }

    deleteselectedDevices(): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected contacts?';
    }
}
