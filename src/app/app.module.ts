import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatDividerModule, MatListModule } from '@angular/material';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { fuseConfig } from 'app/fuse-config';

import { FakeDbService } from 'app/fake-db/fake-db.service';
import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { LoginModule } from 'app/main/login/Login.module';
import { AnalyticsModule } from 'app/main/analytics/analytics.module';
import { deviceprovisioningModule } from 'app/main/device-provisioning/device-provisioning.module';
import { DevicesModule } from 'app/main/device-management/devices.module';
import { ApiSettings } from './shared/apiSettings';
import { IdentityService } from './shared/services/identity.service';
import { JwtInterceptor } from './shared/extensions/jwt.interceptor';
import { ErrorInterceptor } from './shared/extensions/error.interceptor';
import { ProfileComponent } from './main/profile/profile.component';
import { TenantManagementModule } from './main/tenant-management/tenant-management.module';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CognitoTenentService } from './shared/services/cognito.tenant.service';
import { PagerExtension } from './shared/extensions/pager.extension';
import { ErrorModule } from './main/errors/error.module';
import { OnlineStatusComponent } from './main/errors/online-status/online-status.component';
import { ChartsModule } from 'ng2-charts';
import { AppManagerService } from './shared/services/app-manager.service';

const appRoutes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'deviceprovisioning', redirectTo: 'device-provisioning' },
    { path: 'devicemanagement', redirectTo: 'device-management' },  
    { path: 'tenantmanagement', redirectTo: 'tenant-management' },
    { path: 'profile', component: ProfileComponent }
];

@NgModule({
    declarations: [
        AppComponent,
        ProfileComponent,
        OnlineStatusComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        NgxSpinnerModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),
        InMemoryWebApiModule.forRoot(FakeDbService, {
            delay: 0,
            passThruUnknownUrl: true
        }),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatListModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        LoginModule,
        AnalyticsModule,
        deviceprovisioningModule,
        DevicesModule,
        TenantManagementModule,
        ErrorModule,
        ChartsModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        ApiSettings,
        IdentityService,
        CognitoTenentService,
        PagerExtension,
        AppManagerService
    ],
    bootstrap: [
        AppComponent
    ],

    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule {
}
