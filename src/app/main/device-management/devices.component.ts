import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { takeUntil, startWith, map } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DevicesService } from 'app/main/device-management/devices.service';
import { LoggedInCallback } from 'app/shared/services/cognito.tenant.service';
import { IdentityService } from 'app/shared/services/identity.service';
import { Router } from '@angular/router';
import { AppManagerService, PageTab } from 'app/shared/services/app-manager.service';

@Component({
  selector: 'devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DevicesComponent implements LoggedInCallback, OnInit, OnDestroy {
  companies = new FormControl();
  companyList: string[] = ['Oralcare', 'Columbain Brew'];
  selectedCompany: any;

  uploadedby = new FormControl();
  uploadUsers: string[] = [];
  deviceType: string[];
  companyName: any[]=[];
  checkboxes: {};
  dialogRef: any;
  hasSelectedDevices: boolean;
  searchInput: FormControl;
  NameControl = new FormControl();
  filteredOptions: Observable<any[]>;
  tenantid:string;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _devicesService: DevicesService,
    private _fuseSidebarService: FuseSidebarService,
    public router: Router,
    private identity: IdentityService,
    private appManagerService: AppManagerService
  ) {
    this._unsubscribeAll = new Subject();
    this.searchInput = new FormControl('');
  }

  ngOnInit(): void {
    this.appManagerService.currentPageTab = PageTab.DeviceManagement;

    this.identity.tenentIsLoggedIn(this);

    // this._devicesService.fetchAllTenants().subscribe((res: any) => {
    //   const tenantsList = res.data.tenants.filter(item =>
    //      item.Status === 'ENABLED'
    // ).map(t => ({name: t.Name, id: t.TenantId}));
    //   this.tenants = tenantsList.filter((item, pos) => tenantsList.indexOf(item) === pos);        
    //   this.selectedCompany=this.tenants[0];
    // });

    this._devicesService.fetchAllTenants().subscribe((res: any) => {
      const tenantsList = res.data.tenants.filter(item =>
         item.Status === 'ENABLED' && item.Name !='Cypress'
    ).map(t => ({name: t.Name, id: t.TenantId}));      
      this.companyName = tenantsList.filter((item, pos) => tenantsList.indexOf(item) === pos);       
      this.companyName = this.companyName.sort(function (a, b) {
        return a.name.localeCompare( b.name );
    })
      this.NameControl = new FormControl(this.companyName[0].name);
      localStorage.setItem('managementSelectedTenent', this.companyName[0].name);
      this._devicesService.onTenantChanged.next(this.companyName[0].id)
      this.filteredOptions = this.NameControl.valueChanges
    .pipe(
      startWith(''),
      map(val => val ? this._filter(val) : this.companyName.slice())
    );
    });

    this._devicesService.onSelectedDevicesChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(selectedDevices => {
        this.hasSelectedDevices = selectedDevices.length > 0;
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

  applyFilter(filterValue: string): void {
    this._devicesService.onSearchTextChanged.next(filterValue);
  }
  onKeydown(event) {
    if (event.key === "Enter") {   
      localStorage.setItem('managementSelectedTenent', '');

      this.tenantChange(this.NameControl.value)     
     // this._devicesService.onTenantChanged.next(this.NameControl.value);
    // this._devicesService.onSearchTextChanged.next(this.NameControl.value);

    }
  }

  tenantChange(selectedValue): void { 
    if (selectedValue) {
      this.tenantid = this.companyName.filter(e => e.name.toLowerCase() == selectedValue.toLowerCase()).map((i) => i.id)[0];
      if (!this.tenantid) {
        this.tenantid = "0";
      }
    }
    else if (selectedValue === '') {
      this.tenantid = "0";
    }    
    localStorage.setItem('managementSelectedTenent', selectedValue);
   // let id = this.companyName.filter(e=>e.name==selectedValue).map((i)=>i.id)[0];   
    this._devicesService.onTenantChanged.next(this.tenantid);
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
