import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Location } from '@angular/common';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { Tenant } from 'app/shared/models/tenant.model';
import { TenantService } from 'app/main/tenant-management/edit-tenant/edit-tenant.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TenantsService } from '../tenants.service';
import { MatSnackBar } from '@angular/material';
import { LoggedInCallback } from 'app/shared/services/cognito.tenant.service';

@Component({
  selector: 'tenant-details',
  templateUrl: './edit-tenant.component.html',
  styleUrls: ['./edit-tenant.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EditTenantComponent implements LoggedInCallback, OnInit, OnDestroy {

  tenant: Tenant;
  pageType: string;
  tenantForm: FormGroup;
  tenantsList: any;
  result: any;
  submitted = false;
  Countries: any = ['US', 'INDIA', 'GERMANY','UK'];
  statusesList: any = ['CREATED', 'ENABLED', 'DISABLED', 'SUSPENDED', 'DELETED'];
  tenantCode: string;
  status = false;
  code = true;
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

  isLoggedIn(message: string, isLoggedIn: boolean): void {
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.showLoadingIndicator = true;
    const tenantId = this.route.snapshot.paramMap.get('id');

    if (this.route.snapshot.url[1].path && this.route.snapshot.url[1].path === 'copy') {
      // this.code = false;
      // this.status = true;
    }

    if (tenantId) {
      this.getTenant(tenantId);
    }

    this.tenantForm = new FormGroup({
      TenantCode: new FormControl(),
      Name: new FormControl('', Validators.required),
      Description: new FormControl(),
      Address: new FormGroup({
        Street: new FormControl(),
        Area: new FormControl(),
        City: new FormControl(),
        State: new FormControl('',[Validators.required]),
        Country: new FormControl('',[Validators.required]),
        ZipCode: new FormControl('',[Validators.required])
      }),
      ContactDetails: this._formBuilder.array([
      ]),
      Status: new FormControl()
    });

  }

  setStep(index: number): void {
    this.step = index;
  }


  getTenant(id: string): void {
    this._tenantsService.fetchTenantById(id)
      .subscribe(
        (res: any) => {
          this.showLoadingIndicator = false;
          this.tenant = res.data.result;
          this.editTenant(this.tenant);
        });
  }

  editTenant(tenant: Tenant): void {
    this.tenantCode = tenant.TenantShortCode;
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
  }

  addContact(): void {
    this.step++;
    this.contactArray.push(this.addContactGroup());
  }

  removeContact(index): void {
    this.contactArray.removeAt(index);
    this.step--;
  }

  get f() { return this.tenantForm.controls; }

  get fa() { return (this.tenantForm.get('Address') as FormArray).controls; }

  get contactArray() {
    return <FormArray>this.tenantForm.get('ContactDetails');
  }

  getValidity(i): any {
    return (<FormArray>this.tenantForm.get('ContactDetails')).controls[i].invalid;
  }

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
    this.submitted = true;
    // stop here if form is invalid
    if (this.tenantForm.invalid) {
      return;
    }

    const contacts = this.tenantForm.get('ContactDetails').value;
    const count = contacts.filter(e => e.IsPrimary == true).length;

    if (count === 0) {
      this._snackBar.open('Please select atleast one contact as Primary', '', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'snackError',
      });
      return;
    } else if (count > 1) {
      this._snackBar.open('Please select only one contact as Primary', '', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'snackError',
      });
      return;
    }

    this._tenantsService.updateTenant(this.tenantForm.value, this.tenant.TenantId).subscribe(
      (data: any) => {
        this._snackBar.open(data.data.message, '', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'snackSuccess',
        });

        this.router.navigate(['/', 'tenant-management']);
      },
      (error) => {
        this._snackBar.open(error, '', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'snackError',
        });
      }
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
