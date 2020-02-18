import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Observable } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { deviceprovisioningService } from 'app/main/device-provisioning/device-provisioning.service';
import { MatTableDataSource } from '@angular/material/table';
import { Provision } from './device-provisioning.model';
import { Router } from '@angular/router';
import { IdentityService } from 'app/shared/services/identity.service';
import { DatePipe } from '@angular/common';
import { DevicesService } from '../device-management/devices.service';
import { startWith, map } from 'rxjs/operators';
import { LoggedInCallback } from 'app/shared/services/cognito.tenant.service';
import { DeviceProvisionFilter } from 'app/shared/Filters/Filters';
import { MatSnackBar } from '@angular/material';
import { AppManagerService, PageTab } from 'app/shared/services/app-manager.service';

@Component({
    selector: 'device-provisioning',
    templateUrl: './device-provisioning.component.html',
    styleUrls: ['./device-provisioning.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    providers: [DatePipe]
})
export class ContactsComponent implements LoggedInCallback, OnInit, OnDestroy {
    companies = new FormControl();
    companyList: string[] = ['Oralcare', 'Columbain Brew'];
    //selectedCompany: string = "";

    uploadedby = new FormControl();
    uploadUsers: string[] = ['Super Admin', 'DevOps Admin'];
    companyName: any[];
    frompicker = new Date();
    provisions: Provision[];
    selectedCompany: any;
    dialogRef: any;
    hasSelectedContacts: boolean;
    searchInput: FormControl;
    requestsData = new MatTableDataSource(this.provisions);
    pipe: DatePipe;

    lastWorkingDay: Date = new Date();
    fromdate = new FormControl(this.lastWorkingDay);
    DateDiff = this.lastWorkingDay.setDate(this.lastWorkingDay.getDate() - 7);
    todate = new FormControl(new Date());
   // minDate= this.lastWorkingDay.setDate(this.lastWorkingDay.getDate() - 6);
    maxDate = new Date();
    tenantid: string;
    tenantCode : any;
    tenantSCode = new FormControl();
    fileName = new FormControl();
    dpStatus = new FormControl();
    NameControl = new FormControl();
    filteredOptions: Observable<any[]>;
    filters: DeviceProvisionFilter = {
        tenantId: '',
        skip: 0,
        take: 10,
        status: '',
        fromDate: '',
        toDate: '',
        tenantSCode: '',
        fileName: '',
        dpStatus: '',
    }
    snackBarDuration = 3000;
    panelOpenState: boolean = false;

    // Private
    private _unsubscribeAll: Subject<any>;

    // filterForm = new FormGroup({
    //     fromDate: new FormControl(),
    //     toDate: new FormControl(),
    // });

    //fromDate() { return this.filterForm.get('fromDate').value; }
    // toDate() { return this.filterForm.get('toDate').value; }

    /**
     * Constructor
     *
     * @param {ContactsService} _contactsService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     * 
     */
    constructor(
        private _deviceprovisioningService: deviceprovisioningService,
        private _fuseSidebarService: FuseSidebarService,
        public router: Router,
        private _matDialog: MatDialog,
        private identity: IdentityService,
        public datepipe: DatePipe,
        private _devicesService: DevicesService,
        private _snackBar: MatSnackBar,
        private appManagerService: AppManagerService
    ) {
        // Set the defaults
        this.searchInput = new FormControl('');


        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.appManagerService.currentPageTab = PageTab.DeviceProvisioning;
        
        this.identity.tenentIsLoggedIn(this);

        this._devicesService.fetchAllTenants().subscribe((res: any) => {
            const tenantsList = res.data.tenants.filter(item =>
                item.Status === 'ENABLED' && item.Name != 'Cypress'
            ).map(t => ({ name: t.Name, id: t.TenantId }));
            this.companyName = tenantsList.filter((item, pos) => tenantsList.indexOf(item) === pos);
            this.companyName = this.companyName.sort(function (a, b) {
                return a.name.localeCompare( b.name );
            })
            this.companyName.unshift({ id: 0, name: 'All Companies' })           
            this.NameControl = new FormControl(this.companyName[0].name);
            this.filteredOptions = this.NameControl.valueChanges
                .pipe(
                    startWith(''),
                    map(val => val ? this._filter(val) : this.companyName.slice())
                );
        });
        this._deviceprovisioningService.fetchAllRequests(this.filters)
            .subscribe((res: any) => {
                this.provisions = res.data.requests;
                this.requestsData = new MatTableDataSource(this.provisions);
            });
    }

    isLoggedIn(message: string, isLoggedIn: boolean): void {
        if (!isLoggedIn) {
            this.router.navigate(['/login']);
        }
    }

    _filter(name: string): string[] {
        return this.companyName.filter(option =>
            option.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

    applyFilter() {

        const fromDate = this.datepipe.transform(this.fromdate.value, 'MM/dd/yyyy');
        const toDate = this.datepipe.transform(this.todate.value, 'MM/dd/yyyy');
        
                
        if (new Date(fromDate) >= new Date(toDate)) {
           
            this._snackBar.open("Please ensure that To Date is greater than From Date.", '', {
                duration: this.snackBarDuration,
                verticalPosition: 'top',
                horizontalPosition: 'right',
                panelClass: 'snackError',
            });
            return false;
         }
      //return true;
        this.tenantid = '';
        if (this.NameControl.value) { 
            if(this.NameControl.value.toLowerCase() === 'all companies')
            {
                this.tenantid = this.companyName.filter(e => e.name.toLowerCase() == this.NameControl.value.toLowerCase()).map((i) => i.id)[0]
            }
            else{
                this.tenantid = this.companyName.filter(e => e.name.toLowerCase() == this.NameControl.value.toLowerCase()).map((i) => i.id)[0];               
                if(!this.tenantid)
                {
                  this.tenantid="0";
                }
            } 
        }
       else if(this.NameControl.value === '')
       {
        this.tenantid="0";
       }
      
        const searchObject = { search: this.tenantid, fromDate: this.fromdate.value, toDate: this.todate.value, tenantSCode:this.tenantSCode.value, fileName:this.fileName.value, dpStatus:this.dpStatus.value}
       
        this._deviceprovisioningService.onSearchTextChanged.next(searchObject);
        this._deviceprovisioningService.onSearchTextChanged.next(searchObject);
    }

    // applyFilter(filterValue: string) {
    //     this._deviceprovisioningService.onSearchTextChanged.next(filterValue);
    // }

    // selectedChange(selectedValue: string) {
    //     this._deviceprovisioningService.onSelectedChanged.next(selectedValue);
    // }

    onKeydown(event) {       
        if (event.key === "Enter") {   
         this.applyFilter();
        }
      }

    fromDateChange() {
        let date = {
            fromDate: this.fromdate.value,
            toDate: this.todate.value
        };

        this._deviceprovisioningService.onDateFilter.next(date);
    }

    toDateChange() {
        let date = {
            fromDate: this.fromdate.value,
            toDate: this.todate.value
        };

        this._deviceprovisioningService.onDateFilter.next(date);
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
    * Toggle the sidebar
    *
    * @param name
    */
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    
}
