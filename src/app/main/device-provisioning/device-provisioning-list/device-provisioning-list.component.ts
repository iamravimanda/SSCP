import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { deviceprovisioningService } from 'app/main/device-provisioning/device-provisioning.service';
import { Sort, MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Provision } from 'app/shared/models/request.model';
import { MatPaginator } from '@angular/material/paginator';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { DeviceDetailsDialog } from '../device-details-dialog/device-details-dialog.component';
import { DatePipe } from '@angular/common';
import { DeviceProvisionFilter, DevicesFilter } from 'app/shared/Filters/Filters';
import { PagerExtension } from 'app/shared/extensions/pager.extension';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'device-provisioning-list',
    templateUrl: './device-provisioning-list.component.html',
    styleUrls: ['./device-provisioning-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ]

})
export class deviceprovisioningListComponent implements OnInit, OnDestroy {

    @ViewChild(MatSort, { static: true }) sort: MatSort;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    show: boolean = false;
    user: any;
    columnsToDisplay = ['ProvisioningRequestId', 'TenantId', 'FileName', 'CreatedDate', 'Status','Buttons'];
    chartSchema = { domain: ['#4DC758', '#0876CB', '#F79321', '#E52125', '#Z79321', '#EZ2125' , '#EZ2125'] };
    request: Provision[];
    requestsData = new MatTableDataSource(this.request);
    expandedElement: any;
    dataSubSource: any;
    provDevicesData: any;
    chartData: any[];
    scount: number;
    pscount: number;
    rcount: number;
    fcount: number;
    recordscount: number;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    filterBy: string;
    flag = false;
    filteredRequestsData: any[];
    companyName: string[];
    Status: string[];
    lastWorkingDay: Date = new Date();
    todate1 = this.lastWorkingDay.setDate(this.lastWorkingDay.getDate() - 7);
    fdate = this.lastWorkingDay;
    tdate = new Date();
    selectedCompany: string;
    selectedStatus: string
    showLoadingIndicator = true;
    showLoadingIndicator1 = true;
    pager: any = {};
    take: number = 10;
    currentPageNumber: number = 1;
    filters: DeviceProvisionFilter = {
        tenantId: '',
        skip: 0,
        take: this.take,
        status: 'all',
        fromDate: '',
        toDate: '',
        tenantSCode : '',
        fileName : '',
        dpStatus: '',
    }
    totalRecords: number = 0;
    Devicepager: any = {};
    Devicetake: number = 10;
    currentDevicePageNumber: number = 1;
    devicefilters: DevicesFilter = {
        requestId: '',
        skip: 0,
        take: this.Devicetake,
        status: null
    }
    totalDeviceRecords: number = 0;


    /**
     * Constructor
     *
     * @param {ContactsService} _contactsService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _deviceprovisioningService: deviceprovisioningService,
        public _matDialog: MatDialog,
        public datepipe: DatePipe,
        private _pager: PagerExtension,
        private _snackBar: MatSnackBar
    ) {
        // Set the private defaults
        this.dataSubSource = null;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        sessionStorage.removeItem('companyName');
        sessionStorage.removeItem('Status');
        this.showLoadingIndicator = true;

        const fromDate = this.datepipe.transform(this.fdate, 'yyyy-MM-dd');
        const toDate = this.datepipe.transform(this.tdate, 'yyyy-MM-dd');
        this.filters.fromDate = fromDate;
        this.filters.toDate = toDate;
        this.getProvisions();

        // this._deviceprovisioningService.fetchAllRequests({ fromDate: '', skip: 0, take: this.take, status: '', tenantId: '', toDate: '' })
        //     .subscribe(
        //         (res: any) => {
        //             var Status = res.data.requests.map(t => t.Status);
        //             this.Status = Status.filter(function (item, pos) {
        //                 return Status.indexOf(item) == pos;
        //             });
        //         });

        this._deviceprovisioningService.onSearchTextChanged
            .subscribe(searchText => {
                this.filters.fromDate = this.datepipe.transform(searchText.fromDate, 'yyyy-MM-dd');
                this.filters.toDate = this.datepipe.transform(searchText.toDate, 'yyyy-MM-dd');
                this.filters.tenantId = searchText.search;
                this.filters.status = searchText.dpStatus;;
                this.filters.skip = 0;
                this.filters.take = this.take;
                this.currentPageNumber = 1;
                this.filters.fileName = searchText.fileName;
                this.filters.tenantSCode =searchText.tenantSCode;
                this.getProvisions();

            });

        this._deviceprovisioningService.onFilterChanged
            .subscribe(filterdata => {
                this.filters.status = filterdata.status;
                this.filters.skip = 0;
                this.currentPageNumber = 1;
                this.getProvisions();
            });
        //  this.showLoadingIndicator = false;
    }

    unselect(): void {
        this.selectedCompany = undefined;
        this.selectedStatus = undefined;
    }

    statusChange(filterValue: string) {
        this.filters.status = filterValue;
        this.getProvisions();
    }
    setPager(pageNum: number, gauge: string) {
        let skip = 0;
        if (gauge === 'first') {
            skip = 0;
        }
        if (gauge === 'last') {
            skip = (pageNum - 1) * this.filters.take;
        }
        if (gauge === 'prev') {
            skip = (pageNum - 1) * this.filters.take;
        }
        if (gauge === 'next') {
            skip = (pageNum - 1) * this.filters.take;
        }
        this.pager.currentPage = pageNum;
        this.currentPageNumber = pageNum;
        this.filters.skip = skip;
        this.getProvisions();
    }

    getProvisions() {

        this._deviceprovisioningService.fetchAllRequests(this.filters)
            .subscribe(
                (res: any) => {
                    this.showLoadingIndicator = false;
                    var Tenents = res.data.requests.map(t => t.TenantId);
                    this.companyName = Tenents.filter(function (item, pos) {
                        return Tenents.indexOf(item) == pos;
                    });
                    this.companyName.splice(0, 0, 'All Companies');

                    this.request = res.data.requests as Provision[];
                    let data = this.request;
                    // const fromDate = this.datepipe.transform(this.fdate, 'MM/dd/yyyy');
                    // const toDate = this.datepipe.transform(this.tdate, 'MM/dd/yyyy');

                    // data = this.request.filter((item) => {
                    //     if (this.datepipe.transform(new Date(item.CreatedDate), 'MM/dd/yyyy') >= fromDate && this.datepipe.transform(new Date(item.CreatedDate), 'MM/dd/yyyy') <= toDate) {
                    //         return item;
                    //     }
                    // });
                    this.totalRecords = res.data.totalNoRequests
                    this.pager = this._pager.getPager(this.totalRecords, this.currentPageNumber, this.take);
                    this.requestsData = new MatTableDataSource(data);
                    this.requestsData.sort = this.sort;

                    this.requestsData.paginator = this.paginator;
                    this.flag = this.requestsData.filteredData.length > 0 ? true : false;
                    this.filteredRequestsData = this.requestsData.filteredData;
                },
                err => {
                    this.showLoadingIndicator = false;
                    this.request = undefined;
                    this.requestsData = null;
                    this.flag = false;

                });

    }

    onChartClick(event) {           
         if(this.chartData.filter(e=>e.value>0).length>1)
        {
            this.show = true;
            let devices = this.provDevicesData;
            this.selectedStatus = event.name;
            this.devicefilters.status = this.getStatus(this.selectedStatus);
            this.getDevices();
        }      
    }

    getStatus(stat: string): string {
        let status = '';
        if (stat === 'Success')
            status = 'SuccessfullyProvisioned';
        if (stat === 'Partial Success')
            status = 'PartiallyProcessed';
        if (stat === 'Received')
            status = 'RequestReceived';
        if (stat === 'Failed')
            status = 'FailedProvisioning';

        return status;
    }

    tanentChange(filterValue: string) {

        sessionStorage.setItem('companyName', filterValue);
        const status = sessionStorage.getItem('Status');
        if (filterValue != 'All Companies') {
            if (status) {
                let data = this.filteredRequestsData || this.request;

                data = this.request.filter((item) => {
                    if (item.TenantId == filterValue && item.Status == status) {
                        return item;
                    }
                });
                this.requestsData = new MatTableDataSource(data);
                this.requestsData.sort = this.sort;
                this.requestsData.paginator = this.paginator;
                this.flag = this.requestsData.filteredData.length > 0 ? true : false;
                this._deviceprovisioningService.onProvisionsDataChanged.next(this.requestsData.filteredData);
                this.filteredRequestsData = this.requestsData.filteredData;
            }
            else {
                this.requestsData = new MatTableDataSource(this.request);
                this.requestsData.filter = filterValue;
                this.requestsData.sort = this.sort;
                this.requestsData.paginator = this.paginator;
                this._deviceprovisioningService.onProvisionsDataChanged.next(this.requestsData.filteredData);
                this.filteredRequestsData = this.requestsData.filteredData;
            }

        }
        else {
            sessionStorage.removeItem('companyName');
            if (status) {
                this.requestsData = new MatTableDataSource(this.request);
                this.requestsData.sort = this.sort;
                this.requestsData.filter = status;
                this.requestsData.paginator = this.paginator;
                this._deviceprovisioningService.onProvisionsDataChanged.next(this.requestsData.filteredData);
                this.filteredRequestsData = this.requestsData.filteredData;
            }
            else {
                this.requestsData = new MatTableDataSource(this.request);
                this.requestsData.sort = this.sort;
                this.requestsData.paginator = this.paginator;
                this.flag = this.requestsData.filteredData.length > 0 ? true : false;
                this._deviceprovisioningService.onProvisionsDataChanged.next(this.requestsData.filteredData);
                this.filteredRequestsData = this.requestsData.filteredData;
            }

        }


    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
    }

    onRowClick(evt, rowdata): void {
        this.show = false;
        this.selectedStatus = null;
        this.dataSubSource = [];
        this.chartData = [];
        this.currentDevicePageNumber = 1;
        this.devicefilters.status = null;
        this.expandedElement = this.expandedElement === rowdata ? null : rowdata;
        this.devicefilters = {
            requestId: rowdata.ProvisioningRequestId,
            skip: 0,
            take: this.Devicetake,
            status: null
        }

        if (this.expandedElement != null) {
            this.getDevices();
        }
        else {
            this.showLoadingIndicator1 = false;
        }
    }

    resetDeviceSelection() {
        this.selectedStatus = null;
        this.dataSubSource = [];
        this.chartData = [];
        this.currentDevicePageNumber = 1;
        this.devicefilters.status = null;
        this.getDevices();
    }

    setDevicePager(pageNum: number, gauge: string) {
        let skip = 0;
        if (gauge === 'first') {
            skip = 0;
        }
        if (gauge === 'last') {
            skip = (pageNum - 1) * this.devicefilters.take;
        }
        if (gauge === 'prev') {
            skip = (pageNum - 1) * this.devicefilters.take;
        }
        if (gauge === 'next') {
            skip = (pageNum - 1) * this.devicefilters.take;
        }
        this.Devicepager.currentPage = pageNum;
        this.currentDevicePageNumber = pageNum;
        this.devicefilters.skip = skip;
        this.getDevices();
    }

    getDevices() {        
        this.showLoadingIndicator1 = true;
        this._deviceprovisioningService.fetchAllDevices(this.devicefilters)
            .subscribe(
                res => {
                    this.provDevicesData = res.data.devices;
                    if (res.data.devices.length > 0) {
                        this.totalDeviceRecords = res.data.totalNoDevices;
                    } else {
                        this.totalDeviceRecords = 0;
                    }
                    this.Devicepager = this._pager.getPager(this.totalDeviceRecords, this.currentDevicePageNumber, this.Devicetake);
                    this.dataSubSource = this.provDevicesData;
                    
                    this.showLoadingIndicator1 = false;
                    this.scount = res.data.deviceStatusCount.SuccessfullyProvisioned
                    this.pscount = res.data.deviceStatusCount.PartiallySuccessful
                    this.rcount = res.data.deviceStatusCount.RequestProcessing + res.data.deviceStatusCount.RequestReceived;
                    this.fcount = res.data.deviceStatusCount.FailedProvisioning

                    this.chartData = [
                        {
                            name: 'Success',
                            value: this.scount
                        },
                        {
                            name: 'Partial Success',
                            value: this.pscount
                        },
                        {
                            name: 'Received',
                            value: this.rcount
                        },
                        {
                            name: 'Failed',
                            value: this.fcount
                        }
                    ];
                },
                err => {
                    
                    this.dataSubSource = null;
                    this.showLoadingIndicator1 = false;
                }
            );
               }

    openDialog(device: any): void {
        localStorage.setItem('managementSelectedTenent', device.TenantId);
        const dialogRef = this._matDialog.open(DeviceDetailsDialog, {
            position: { top: '0px', right: '0px' },
            height: '100%',
            width: '50%',
            data: { id: device }
        });
    }

    PriventRowClick(e)
    {
      e.stopPropagation();
    }
    deleteProvision(provision): void {       
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
        this.confirmDialogRef.afterClosed().subscribe(result => {            
            if (result) {
              this._deviceprovisioningService.DeleteProvision(provision.ProvisioningRequestId).subscribe(
                (result: any) => {                   
                  this._snackBar.open(result.message, '', {
                    duration: 3000,
                    verticalPosition: 'top',
                    horizontalPosition: 'right',
                    panelClass: 'snackSuccess',
                  });
                });
              this.getProvisions();
            }
            error => {
              this._snackBar.open(error, '', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'right',
                panelClass: 'snackError',
              });
            }
            this.confirmDialogRef = null;
          });
    }

    deleteProvisionRequestDevice(PId, DId): void {       
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
        this.confirmDialogRef.afterClosed().subscribe(result => {            
            if (result) {
              this._deviceprovisioningService.deleteProvisionRequestDevice(PId, DId).subscribe(
                  
                (result: any) => {                   
                  this._snackBar.open(result.message, '', {
                    duration: 3000,
                    verticalPosition: 'top',
                    horizontalPosition: 'right',
                    panelClass: 'snackSuccess',
                  });
                });
              this.getDevices();
            }
            error => {
              this._snackBar.open(error, '', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'right',
                panelClass: 'snackError',
              });
            }
            this.confirmDialogRef = null;
          });
    }


    onClickCopyId(e, id) {
        e.stopPropagation();
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = id;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);

    }
}
