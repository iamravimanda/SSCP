import { Component, OnInit, ViewChild, ElementRef, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSort, MatPaginator, MatTableDataSource, MatSnackBar, PageEvent } from '@angular/material';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, Observable } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { IdentityService } from 'app/shared/services/identity.service';
import { LoggedInCallback } from 'app/shared/services/cognito.tenant.service';
import { TenantList } from 'app/shared/models/tenant.model';
import { TenantsService } from '../tenants.service';

export interface Country {
  name: string;
}

@Component({
  selector: 'app-tenants',
  templateUrl: './tenants.component.html',
  styleUrls: ['./tenants.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TenantsComponent implements LoggedInCallback, OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  columnsToDisplay = ['tenentCode', 'name', 'country', 'state', 'status'];
  tenants: TenantList[];
  tenantsList: any[];
  allTenents: tenentData[] = [];
  tenantsData = new MatTableDataSource(this.allTenents);
  DialogData: any;
  resultList: any[];

  statuses = new FormControl();
  statusesList: string[] = ['Created', 'Enabled', 'Disabled', 'Suspended', 'Deleted'];

  selectedStatus: string;
  masterSelected = false;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  searchInput: FormControl;
  states = [];
  Countries = [];
  NameControl = new FormControl();
  stateControl = new FormControl(this.states);
  countryControl = new FormControl();
  Names = [];
  filteredOptions: Observable<string[]>;
  statefilteredOptions: Observable<string[]>;
  countryfilteredOptions: Observable<string[]>;
  showLoadingIndicator: boolean;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _tenantsService: TenantsService,
    public router: Router,
    private identity: IdentityService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {   
    this.showLoadingIndicator = true;

    this.getTenants();
    this.identity.tenentIsLoggedIn(this);
    this.Countries = ['US', 'INDIA', 'GERMANY','UK'];

    this._tenantsService.onSearchTextChanged.subscribe(searchText => {    
      this.applyFilter(searchText);
    });
  }

  getTenants(): void {
    this._tenantsService.fetchAllTenants()
      .subscribe(
        (res: any) => {
          this.showLoadingIndicator = false;
          this.tenantsList = res.data.tenants;
          this.resultList = res.data.tenants;
          this.Names = this.tenantsList.map(e => e.Name);
          this.states = this.tenantsList.map(e => e.Address.State);
          this.mapAllTenents(this.resultList);
        }
      );
  }

  mapAllTenents(data: any): void {
    this.allTenents = [];

    data.forEach(item => {
      const primary = item.ContactDetails.filter(contact => contact.IsPrimary)[0] || item.ContactDetails[0];
      const result: tenentData = {
        tenantId: item.TenantId,
        tenentCode: item.TenantShortCode,
        country: item.Address.Country,
        name: item.Name,
        state: item.Address.State,
        status: item.Status,
        createdBy: item.CreatedBy,
        createdDate: item.CreatedDate,
        primaryContactEmail: primary.Email,
        primaryContactJobTitle: primary.JobTitle,
        primaryContactName: primary.Name,
        primaryContactPhone: primary.Phone
      };

      this.allTenents.push(result);
    });

    this.tenantsData = new MatTableDataSource(this.allTenents);
    this.tenantsData.sort = this.sort;
    this.paginator.pageIndex = this._tenantsService.getPageIndex();
    this.tenantsData.paginator = this.paginator;
  }

  _filter(val: string): string[] {
    return this.Names.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  _statefilter(val: string): string[] {
    return this.states.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  _countryfilter(val: string): string[] {
    return this.Countries.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  isLoggedIn(message: string, isLoggedIn: boolean): void {
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  applyFilter(filterValue: string): void {
    this.tenantsData.filter = filterValue;
    this.tenantsData.sort = this.sort;
    this._tenantsService.setPageIndex(0);
    this.paginator.pageIndex = 0;
    this.tenantsData.paginator = this.paginator;
  }

  nameFilter(filterValue: string): void {
    if (filterValue) {
      const data = this.allTenents.filter((item) => item.name.toString().toLowerCase().includes(filterValue.toLowerCase()));
      this.tenantsData = new MatTableDataSource(data);
    } else {
      this.tenantsData = new MatTableDataSource(this.allTenents);
    }

    this.tenantsData.paginator = this.paginator;
  }

  stateFilter(filterValue: string): void {
    if (filterValue) {
      const data = this.allTenents.filter((item) => item.state && item.state.toString().toLowerCase().includes(filterValue.toLowerCase()));
      this.tenantsData = new MatTableDataSource(data);
    } else {
      this.tenantsData = new MatTableDataSource(this.allTenents);
    }

    this.tenantsData.paginator = this.paginator;
  }

  countryFilter(filterValue: string): void {
    if (filterValue) {
      const data = this.allTenents.filter((item) => item.country && item.country.toString().toLowerCase().includes(filterValue.toLowerCase()));
      this.tenantsData = new MatTableDataSource(data);
    } else {
      this.tenantsData = new MatTableDataSource(this.allTenents);
    }

    this.tenantsData.paginator = this.paginator;
  }

  statusChange(filterValue: string): void {
    this.tenantsData.filter = filterValue;
    this.tenantsData.sort = this.sort;
    this.tenantsData.paginator = this.paginator;
  }

  onAllCheckChange(): void {
    this.tenantsList = this.tenantsList.map(e => {
      e.isSelected = this.masterSelected;
      return e;
    });
  }

  showTenant(contact): void {

  }

  deleteTenant(tenant): void {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, { disableClose: false });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(confirmResult => {
      if (confirmResult) {
        this._tenantsService.deleteTenant(tenant.tenantId).subscribe((result: any) => {
          this._snackBar.open(result.data.result, '', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'snackSuccess',
          });

          this.getTenants();
        },
          error => {
            this._snackBar.open(error, '', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
              panelClass: 'snackError',
            });
            this.confirmDialogRef = null;
          });
      }
    });
  }

  addTenant(): void {
    localStorage.setItem('backButtonShow', 'true');
    this.router.navigate(['/', 'CreateTenant']);
  }

  onPageChange(e: PageEvent): void {
    this._tenantsService.setPageIndex(e.pageIndex);
  }
}

@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: 'tenant-dialog.html',
})
export class DialogDataExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: 'test') { }
}

export class tenentData {
  tenantId: string;
  tenentCode: string;
  name: string;
  country: string;
  state: string;
  primaryContactName: string;
  primaryContactJobTitle: string;
  primaryContactPhone: string;
  primaryContactEmail: string;
  createdBy: string;
  createdDate: string;
  status: string;
}
