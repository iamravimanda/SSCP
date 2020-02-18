import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { DevicesService } from '../devices.service';
import { Device } from 'app/shared/models/device.model';
import { DeviceDetailsDialogComponent } from '../device-details-dialog/device-details-dialog.component';
import { DeviceManagementFilter } from 'app/shared/Filters/Filters';
import { PagerExtension } from 'app/shared/extensions/pager.extension';

@Component({
  selector: 'devices-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: []
})
export class DevicesDeviceListComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  // columnsToDisplay = ['test', 'DeviceId', 'TenantId', 'DeviceType', 'DeviceGroup', 'Status', 'DataMeter'];
  columnsToDisplay = ['DeviceId', 'TenantId', 'DeviceType', 'DeviceGroup', 'Status', 'DataMeter'];
  devices: Device[];
  devicesData = new MatTableDataSource(this.devices);
  checkboxes: {};
  selectedDevices: any[];
  filteredDevicesData: any[];
  healthStatus: string[] = [];
  isSelected = false;
  selectedDevicesIds: string[] = [];
  spinner1 = 'sp3';
  masterSelected = false;
  checkedList: any;
  flag = false;
  showLoadingIndicator = true;
  filterOptions = {
    companyName: '',
    searchText: '',
    healthStatus: ''
  };
  pager: any = {};
  take: number = 1000;
  currentPageNumber: number = 1;
  filters: DeviceManagementFilter = {
    tenantId: '',
    skip: 0,
    take: this.take
  }
  totalRecords: number = 0;

  constructor(
    private _devicesService: DevicesService,
    private _pager: PagerExtension,
    public _matDialog: MatDialog
  ) {

  }

  ngOnInit(): void {   
    this.showLoadingIndicator = true;
    // this.loadDevices();

    this._devicesService.onSearchTextChanged.subscribe(searchText => {    
      this.filterOptions.searchText = searchText;
      this.searchDevices();
    });

    this._devicesService.onFilterChanged.subscribe(filterdata => {
      this.paginator.pageIndex=0;
      if (filterdata === 'all') {        
        this.devicesData = new MatTableDataSource(this.devices);
        this.devicesData.paginator = this.paginator;
      } else {        
        this.devicesData.filter = filterdata;
        this.devicesData.paginator = this.paginator;
      }
    });

    this._devicesService.onTenantChanged.subscribe(searchText => {
      if(searchText != '')
      {
        this.filters.tenantId = searchText;
        this.loadDevices();
      }
      else{ 
        this.flag = false;
         this.devices=undefined;    
         this.devicesData=null;         
         this.paginator.length=0
         this.publishDevicesChangeEvent(this.devices);           
      }
      
      // this.filters.tenantId=searchText;
      // this._devicesService.fetchDevicesByTenant(this.filters).subscribe((res: any) => {
      //   this.devices = res.data.telemetry as Device[];
      //   this.totalRecords = res.data.totalDevices
      //   this.pager = this._pager.getPager(this.totalRecords, this.currentPageNumber, this.take);
      //   this.devicesData = new MatTableDataSource(this.devices);
      //   this.publishDevicesChangeEvent(this.devices);       
      // },err => {
      //   this.devices=undefined;    
      //   this.devicesData=null;
      //   this.publishDevicesChangeEvent(this.devices);
      // });
    });

    this._devicesService.onSelectedDevicesChanged.subscribe(selectdCheckboxes => {
      if (!selectdCheckboxes) {
        for (const device of this.devices) {
          device.isSelected = selectdCheckboxes;
        }
        this.isSelected = selectdCheckboxes;
      } else {
        this.isSelected = false;
      }
    });

    //  this.showLoadingIndicator = false;
  }

  searchDevices(): void {
    this.devicesData = new MatTableDataSource(this.devices);
    if (this.filterOptions.searchText !== '') {
      this.devicesData.filter = this.filterOptions.searchText;
    }  
    this.paginator.pageIndex = 0;
    this.devicesData.sort = this.sort;
    this.devicesData.paginator = this.paginator;
    this.flag = this.devicesData.filteredData.length > 0 ? true : false;

    this.publishDevicesChangeEvent(this.devicesData.filteredData);
  }

  openDialog(deviceData: any): void {
    const dialogRef = this._matDialog.open(DeviceDetailsDialogComponent, {
      position: { top: '0px', right: '0px' },
      height: '100%',
      width: '50%',
      data: { deviceData  }
    });
  }

  onSelectedChange(deviceId): void {
    this._devicesService.toggleSelectedDevice(deviceId);
  }

  onAllCheckChange(): void {
    this.masterSelected = !this.masterSelected;

    this.devices = this.devices.map(e => {
      e.isSelected = this.masterSelected;
      return e;
    });

    if (this.masterSelected) {
      this.devices.map(d => { this.selectedDevicesIds.push(d.DeviceId); });

      this.selectedDevicesIds = this.selectedDevicesIds.slice(0, this.paginator.pageSize);
      this._devicesService.toggleSelectAll(this.selectedDevicesIds);
    } else {
      this._devicesService.deselectDevices();
    }
  }
  healthStatusChange(filterValue: string): void {
    let data = this.devices;

    if (filterValue !== 'All Health States') {
      data = this.devices.filter((item) => item.HealthStatus === filterValue);
    }

    this.devicesData = new MatTableDataSource(data);
    this.devicesData.paginator = this.paginator;
    this.publishDevicesChangeEvent(data);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
  }

  //#region | Private Methods |

  //   setPager(pageNum: number, gauge: string) {
  //     let skip = 0;
  //     if (gauge === 'first') {
  //         skip = 0;
  //     }
  //     if (gauge === 'last') {
  //         skip = (pageNum - 1) * this.filters.take;
  //     }
  //     if (gauge === 'prev') {
  //         skip = (pageNum - 1) * this.filters.take;
  //     }
  //     if (gauge === 'next') {
  //         skip = (pageNum - 1) * this.filters.take;       
  //     }
  //     this.pager.currentPage = pageNum;
  //     this.currentPageNumber = pageNum;
  //     this.filters.skip = skip;
  //     this.loadDevices();
  // }

  loadDevices(): void {
    this._devicesService.fetchDevicesByTenant(this.filters).subscribe((res: any) => {
      this.showLoadingIndicator = false;
      this.devices = res.data.telemetry as Device[];
      // this.totalRecords = res.data.totalDevices
      // this.pager = this._pager.getPager(this.totalRecords, this.currentPageNumber, this.take);
      this.devices = this.devices.map((item) => {
        item.HealthStatus = this.convertToTitleCase(item.HealthStatus);
        return item;
      });
      this.searchDevices();
      this.checkboxes = {};
      this.devices.map(device => { this.checkboxes[device.DeviceId] = false; });

      this.healthStatus = ([...new Set(this.devices.map(e => e.HealthStatus))]).sort();
      this.healthStatus.splice(0, 0, 'All Health States');
    },
      err => {
        this.showLoadingIndicator = false;
        this.flag = false;
        this.devices = null;
        this.devicesData = null;
        this.paginator.length=0;
        this.publishDevicesChangeEvent(this.devices)
      }
    );
    // });    

  }

  private convertToTitleCase(value: string): string {
    if (value === null || value === '') {
      return value;
    }

    const words = value.toLowerCase().split('_');

    for (let ii = 0; ii < words.length; ii++) {
      words[ii] = words[ii].charAt(0).toUpperCase() + words[ii].slice(1);
    }

    return words.join(' ');
  }

  private publishDevicesChangeEvent(data: any[]): void {

    const result = [];

    if (data) {
      const uniqueHealthStatuses = ([...new Set(data.map(e => e.HealthStatus))]).sort();

      for (status of uniqueHealthStatuses) {
        result.push({ status: status, count: data.filter(e => e.HealthStatus === status).length });
      }
    }

    this._devicesService.onDevicesDataChanged.next(result);
  }

  //#endregion
}
