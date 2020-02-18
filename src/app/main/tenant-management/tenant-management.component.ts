import { Component, OnInit } from '@angular/core';
import { TenantsService } from './tenants.service';
import { AppManagerService, PageTab } from 'app/shared/services/app-manager.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tenant-management',
  templateUrl: './tenant-management.component.html',
  styleUrls: ['./tenant-management.component.scss']
})
export class TenantManagementComponent implements OnInit {

  constructor(
    private _tenantsService: TenantsService,
    private appManagerService: AppManagerService,
    public router: Router,
  ) { 
    
  }

  ngOnInit() {
    if (this.appManagerService.currentPageTab !== PageTab.TenantManagement){
      this._tenantsService.setPageIndex(0);
    }
    
    this.appManagerService.currentPageTab = PageTab.TenantManagement;
  }

  applyFilter(filterValue: string): void {
    this._tenantsService.onSearchTextChanged.next(filterValue);
  }

  addTenant(): void {
    localStorage.setItem('backButtonShow', 'true');
    this.router.navigate(['/', 'CreateTenant']);
  }

}
