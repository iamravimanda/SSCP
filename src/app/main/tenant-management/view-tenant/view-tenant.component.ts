import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Location } from '@angular/common';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';

import { Tenant } from 'app/shared/models/tenant.model';
import { TenantService } from 'app/main/tenant-management/edit-tenant/edit-tenant.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TenantsService } from '../tenants.service';
import { MatSnackBar } from '@angular/material';
import { LoggedInCallback } from 'app/shared/services/cognito.tenant.service';

@Component({
  selector: 'tenant-details',
  templateUrl: './view-tenant.component.html',
  styleUrls: ['./view-tenant.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ViewTenantComponent implements LoggedInCallback, OnInit, OnDestroy {
  tenant: Tenant;
  // pageType: string;
  tenantForm: FormGroup;
  // tenantsList:any;
  // result:any;
  // submitted=false;
  Countries: any = ['US', 'INDIA', 'GERMANY','UK'];
  // statusesList: any = ['CREATED', 'Enabled', 'Disabled', 'Suspended', 'Deleted'];
  // tenantId:string;
  showLoadingIndicator: boolean;
  step = 0;

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _tenantService: TenantService,
    private _tenantsService: TenantsService,
    private _formBuilder: FormBuilder,
    private _location: Location,
    private route: ActivatedRoute,
    public router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.tenant = new Tenant();
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.showLoadingIndicator = true;

    const tenantId = this.route.snapshot.paramMap.get('id');

    if (tenantId) {
      this.getTenant(tenantId);
    }

    this.tenantForm = new FormGroup({
      TenantCode: new FormControl(),
      Name: new FormControl(),
      Description: new FormControl(),
      Status: new FormControl(),
      Address: new FormGroup({
        Street: new FormControl(),
        Area: new FormControl(),
        City: new FormControl(),
        State: new FormControl('',[Validators.required]),
        Country: new FormControl('',[Validators.required]),
        ZipCode: new FormControl('',[Validators.required])
      }),
      ContactDetails: this._formBuilder.array([ ])
    });

    this.tenantForm.disable();
  }

  isLoggedIn(message: string, loggedIn: boolean): void {
    if (!loggedIn) {
      this.router.navigate(['/login']);
    }
  }

  setStep(index: number): void {
    this.step = index;
  }

  getTenant(id: string): any {
    this._tenantsService.fetchTenantById(id)
      .subscribe(
        (res: any) => {
          this.showLoadingIndicator = false;
          this.tenant = res.data.result;
          this.viewTenant(this.tenant);
        });
  }

  viewTenant(tenant: Tenant): void {
    this.tenantForm.patchValue({
      TenantCode: tenant.TenantShortCode,
      Name: tenant.Name,
      Description: tenant.Description,
      Status: tenant.Status,
      Address: {
        Street: tenant.Address.Street,
        Area: tenant.Address.Street,
        City: tenant.Address.City,
        State: tenant.Address.State,
        Country: tenant.Address.Country,
        ZipCode: tenant.Address.ZipCode
      },
      ContactDetails: this.ContactDetails()
    });
  }

  ContactDetails(): void {
    const control = <FormArray>this.tenantForm.controls.ContactDetails;
    
    this.tenant.ContactDetails.forEach(x => {
      control.push(this._formBuilder.group(x));
    });
    this.disableInputs();
  }

  disableInputs(): void {
    (<FormArray>this.tenantForm.get('ContactDetails'))
      .controls
      .forEach(control => {
        control.disable();
      });
  }

  get contactArray() {
    return <FormArray>this.tenantForm.get('ContactDetails');
  }

  
  get fa() { return (this.tenantForm.get('Address') as FormArray).controls; }

  addContactGroup(): any {
    return this._formBuilder.group({
      Name: ['', [Validators.required]],
      Email: ['', [Validators.required, Validators.email]],
      Phone: ['', [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]],
      JobTitle: [''],
      IsPrimary: ['']
    });
  }

  updateTenant(): void {
    this.router.navigate(['tenants', this.tenant.TenantId]);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
