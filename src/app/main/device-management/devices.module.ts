import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatRippleModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatTableModule,
  MatToolbarModule,
  MatSelectModule,
  MatDialogModule,
  MatPaginatorModule,
  MatPaginatorIntl,
  MatTabsModule,
  MatDividerModule,
  MatStepperModule
} from '@angular/material';

import { ChartsModule } from 'ng2-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { NgxSpinnerModule } from 'ngx-spinner';

import { DevicesComponent } from 'app/main/device-management/devices.component';
import { deviceprovisioningService } from 'app/main/device-provisioning/device-provisioning.service';
import { DevicesService } from 'app/main/device-management/devices.service';
import { DevicesDeviceListComponent } from 'app/main/device-management/device-list/device-list.component';
import { DevicesMainSidebarComponent } from 'app/main/device-management/sidebars/main/main.component';
import { DevicesSelectedBarComponent } from 'app/main/device-management/selected-bar/selected-bar.component';
import { SharedModule } from 'app/shared/shared.module';
import { DeviceDetailsDialogComponent } from './device-details-dialog/device-details-dialog.component';
import { MatPaginatorForDevice } from 'app/shared/services/deviceMgnt';
import { FirmwareComponent, CreateFirmwareDialog } from './firmware/firmware.component';
import { NewUpdateCampaignComponent } from './new-update-campaign/new-update-campaign.component';
import { FOTAComponent } from './fota/fota.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';


const routes: Routes = [
  { path: 'device-management', component: DevicesComponent },
  { path: 'firmware', component: FirmwareComponent},
  { path: 'new-update-campaign', component: NewUpdateCampaignComponent},
  { path: 'fota', component: FOTAComponent }
  ];



@NgModule({
  declarations: [
    DevicesComponent,
    DevicesDeviceListComponent,
    DevicesMainSidebarComponent,
    DevicesSelectedBarComponent,
    DeviceDetailsDialogComponent,
    FirmwareComponent,
    CreateFirmwareDialog,
    NewUpdateCampaignComponent,
    FOTAComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule.forRoot(),
    MatButtonModule,
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
    MatPaginatorModule,
    MatTabsModule,
    MatDividerModule,
    NgxSpinnerModule,
    MatStepperModule,
    MatAutocompleteModule
  ],
  providers: [
    deviceprovisioningService,
    DevicesService,
    { provide: MatPaginatorIntl, useClass: MatPaginatorForDevice },
  ],
  entryComponents: [
    DeviceDetailsDialogComponent, CreateFirmwareDialog
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DevicesModule { }
