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
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDividerModule, MatTabsModule, MatTooltipModule } from '@angular/material';
import { MdePopoverModule } from '@material-extended/mde';
import { MatCardModule } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatExpansionModule} from '@angular/material/expansion';


import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { ContactsComponent } from 'app/main/device-provisioning/device-provisioning.component';
import { deviceprovisioningService } from 'app/main/device-provisioning/device-provisioning.service';
import { deviceprovisioningListComponent } from 'app/main/device-provisioning/device-provisioning-list/device-provisioning-list.component';
import { ContactsMainSidebarComponent } from 'app/main/device-provisioning/sidebars/main/main.component';
import { deviceprovisioningFormDialogComponent } from 'app/main/device-provisioning/device-provisioning-form/device-provisioning.component';
import { SharedModule } from 'app/shared/shared.module';
import { MatPaginatorForPro } from 'app/shared/services/customeClass';
import { DeviceDetailsDialog } from './device-details-dialog/device-details-dialog.component';

const routes: Routes = [
    {
        path: 'device-provisioning',
        component: ContactsComponent,
    }
];

@NgModule({
    declarations: [
        ContactsComponent,
        deviceprovisioningListComponent,
        ContactsMainSidebarComponent,
        deviceprovisioningFormDialogComponent,
        DeviceDetailsDialog
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
        MatSortModule,
        MatTooltipModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        MdePopoverModule,
        MatCardModule,
        ChartsModule,
        NgxChartsModule,
        MatPaginatorModule,
        MatDividerModule,
        MatTabsModule,
        MatAutocompleteModule,
        MatExpansionModule

    ],
    providers: [
        deviceprovisioningService,
        { provide: MatPaginatorIntl, useClass: MatPaginatorForPro },
    ],
    entryComponents: [
        deviceprovisioningFormDialogComponent,
        DeviceDetailsDialog

    ]
})
export class deviceprovisioningModule {
}
