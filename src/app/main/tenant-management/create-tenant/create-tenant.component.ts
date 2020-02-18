import { Component, OnInit } from '@angular/core';
import { Tenant, TenantAddress, TenantContact } from 'app/shared/models/tenant.model';
import { FormBuilder, Validators, FormGroup, FormArray, FormGroupName, FormControl, ValidatorFn } from '@angular/forms';
import { TenantsService } from '../tenants.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { LoggedInCallback } from 'app/shared/services/cognito.tenant.service';
import { Address } from 'cluster';

@Component({
  selector: 'app-create-tenant',
  templateUrl: './create-tenant.component.html',
  styleUrls: ['./create-tenant.component.scss']
})
export class CreateTenantComponent implements LoggedInCallback, OnInit {

  source: any;
  result = false;
  tenant: Tenant;
  showLoadingIndicator: boolean;
  temp: any;
  createTenantForm: FormGroup = this.fb.group({
    Name: new FormControl('', Validators.required),
    Description: new FormControl(),
    Status: new FormControl(),
    Address: this.fb.group({
      Street: new FormControl(),
      Area: new FormControl(),
      City: new FormControl(),
      State: new FormControl('', Validators.required),
      Country: new FormControl('', Validators.required),
      ZipCode: new FormControl('', Validators.required)
    }),
    ContactDetails: this.fb.array([
      this.addContactGroup()
    ])
  });
  submitted = false;
  Countries: string[] = ['US', 'INDIA', 'GERMANY','UK'];
  statusesList: string[] = ['CREATED']; //, 'Enabled', 'Disabled', 'Suspended', 'Deleted'];
  showbackbutton: any;
  step = 0;


  constructor(private fb: FormBuilder,
    private _tenantsService: TenantsService,
    private _snackBar: MatSnackBar,
    public router: Router,
    private route: ActivatedRoute) {

  }

  isLoggedIn(message: string, isLoggedIn: boolean): void {
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }
  
  setStep(index: number): void {
    this.step = index;
  }

  ngOnInit(): void {
    this.showLoadingIndicator = true;
    if (localStorage.getItem('backButtonShow') === 'true') {
      this.showbackbutton = true;
      localStorage.removeItem('backButtonShow');
    }

    this.getAddress();
    const tenantId = this.route.snapshot.paramMap.get('id')
    // if(this.route.snapshot.url[1].path && this.route.snapshot.url[1].path=="copy")
    // {
    //  // this.code=false;
    //  // this.status=true
    // }

    if (tenantId) {
      this._tenantsService.fetchTenantById(tenantId)
        .subscribe(
          (res: any) => {
            this.showLoadingIndicator = false;
            this.tenant = res.data.result;
            this.result = true;
            this.getTenant(this.tenant);
          });
    } else {
      this.showLoadingIndicator = false;
    }
  }

  getTenant(tenant: Tenant): void {
    this.createTenantForm.patchValue({
      Name: [tenant.Name],
      Description: [tenant.Description],
      Status: tenant.Status,
      Address: {
        Street: [tenant.Address.Street],
        Area: [tenant.Address.Area],
        City: [tenant.Address.City],
        State: [tenant.Address.State],
        Country: tenant.Address.Country,
        ZipCode: [tenant.Address.ZipCode]
      },
      ContactDetails: this.ContactDetails()
    });
  }

  ContactDetails(): void {
    this.removeContact(0);
    const control = <FormArray>this.createTenantForm.controls.ContactDetails;
    this.tenant.ContactDetails.forEach(x => {
      control.push(this.fb.group(x));
    })
  }


  addContactGroup(): any {
    return this.fb.group({
      Name: ['', [Validators.required]],
      Email: ['', [Validators.required, Validators.email]],
      Phone: ['', [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]],
      JobTitle: [''],
      IsPrimary: ['']
    });
  }

  addContact(): void {
    this.contactArray.push(this.addContactGroup());
    this.step++;
  }

  removeContact(index): void {
    this.contactArray.removeAt(index)
    if (index > 0) {
      this.step--;
    }
  }

  get f() { return this.createTenantForm.controls; }

  get fa() { return (this.createTenantForm.get('Address') as FormArray).controls; }

  get contactArray() {
    return <FormArray>this.createTenantForm.get('ContactDetails');
  }

  getAddress(): any {
    // console.log((this.createTenantForm.get('Address') as FormArray).get('State'));
    return this.createTenantForm.get('Address');
  }

  saveTenant(): any {
    this.submitted = true;
    // stop here if form is invalid
    if (this.createTenantForm.invalid) {
      return;
    }
    const contacts = this.createTenantForm.get('ContactDetails').value;
    const count = contacts.filter(e => e.IsPrimary === true).length;

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

    this._tenantsService.createTenant(this.createTenantForm.value).subscribe(
      (data) => {
        this._snackBar.open(data.data.message, '', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'snackSuccess',
        });
        this.router.navigate(['/', 'tenant-management']);
      },
      error => {
        this._snackBar.open(error, '', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'snackError',
        });
      }
    );
  }
}
