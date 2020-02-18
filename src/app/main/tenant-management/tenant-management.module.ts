import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { SharedModule } from 'app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule, MatTooltipModule, MatStepperModule, MatSnackBarModule } from '@angular/material';
import { MdePopoverModule } from '@material-extended/mde';
import { MatCardModule } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CdkStepperModule } from '@angular/cdk/stepper';

import { TenantsComponent } from './tenants/tenants.component';
import { TenantsService } from './tenants.service';
import { EditTenantComponent } from './edit-tenant/edit-tenant.component';
import { TenantService } from './edit-tenant/edit-tenant.service';
import { CreateTenantComponent } from './create-tenant/create-tenant.component';
import { ViewTenantComponent } from './view-tenant/view-tenant.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TenantManagementComponent } from './tenant-management.component';
import { TenantMainSidebarComponent } from 'app/main/tenant-management/main/main.component';


const routes: Routes = [
  { path: 'tenant-management', component: TenantManagementComponent ,},
  { path: 'tenants', component: TenantsComponent, resolve: { data: TenantsService }, },
  { path: 'tenants/:id', component: EditTenantComponent, resolve: { data: TenantService } },
  { path: 'tenants/copy/:id', component: CreateTenantComponent, resolve: { data: TenantService } },
  // { path: 'tenants/:id/:handle', component: TenantComponent, resolve: { data: TenantService } },
  { path: 'tenants/View/:id', component: ViewTenantComponent, resolve: { data: TenantService } },
  { path: 'CreateTenant', component: CreateTenantComponent }
];

@NgModule({
  declarations: [
    TenantsComponent,
    EditTenantComponent,
    CreateTenantComponent,
    ViewTenantComponent,
    TenantManagementComponent,
    TenantMainSidebarComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule.forRoot(),
    MatButtonModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRippleModule,
    MatTableModule,
    MatToolbarModule,
    MatSelectModule,
    MatDialogModule,
    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule,
    ChartsModule,
    NgxChartsModule,
    MatSortModule,
    MatPaginatorModule,
    MatTabsModule,
    MatDividerModule,
    MatTooltipModule,
    MdePopoverModule,
    MatCardModule,
    MatAutocompleteModule,
    CdkStepperModule,
    MatStepperModule,
    MatExpansionModule,
    Ng2SmartTableModule
  ],
  providers: [
    TenantsService,
    TenantService
  ]
})
export class TenantManagementModule { }
