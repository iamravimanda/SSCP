import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription, Observable, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { navigation } from 'app/navigation/navigation';
import { locale as navigationEnglish } from 'app/navigation/i18n/en';
import { locale as navigationTurkish } from 'app/navigation/i18n/tr';
import { IdentityService } from 'app/shared/services/identity.service';
import { deviceprovisioningService } from 'app/main/device-provisioning/device-provisioning.service';
import { DeviceProvisionFilter } from 'app/shared/Filters/Filters';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    fuseConfig: any;
    navigation: any;

    onlineEvent: Observable<Event>;
    offlineEvent: Observable<Event>;
    subscriptions: Subscription[] = [];

    connectionStatusMessage: string;
    connectionStatus: string;

    filters: DeviceProvisionFilter = {
        tenantId: '',
        skip: 0,
        take: 10,
        status: '',
        fromDate: '',
        toDate: '',
        tenantSCode : '',
        fileName : '',
        dpStatus:'',
    };

    private _unsubscribeAll: Subject<any>;

    constructor(
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseSplashScreenService: FuseSplashScreenService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _translateService: TranslateService,
        private _platform: Platform,
        private _deviceprovisioningService: deviceprovisioningService,
        private identity: IdentityService
    ) {
        this.navigation = navigation;
        this._fuseNavigationService.register('main', this.navigation);
        this._fuseNavigationService.setCurrentNavigation('main');
        this._translateService.addLangs(['en', 'tr']);
        this._translateService.setDefaultLang('en');
        this._fuseTranslationLoaderService.loadTranslations(navigationEnglish, navigationTurkish);
        this._translateService.use('en');
        if (this._platform.ANDROID || this._platform.IOS) {
            this.document.body.classList.add('is-mobile');
        }

        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.onlineEvent = fromEvent(window, 'online');
        this.offlineEvent = fromEvent(window, 'offline');

        this.subscriptions.push(this.onlineEvent.subscribe(e => {
            this.connectionStatusMessage = 'Back to online';
            this.connectionStatus = 'online';
        }));

        this.subscriptions.push(this.offlineEvent.subscribe(e => {
            this.connectionStatusMessage = 'Connection lost! You are not connected to internet';
            this.connectionStatus = 'offline';
        }));

        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {

                this.fuseConfig = config;

                if (this.fuseConfig.layout.width === 'boxed') {
                    this.document.body.classList.add('boxed');
                } else {
                    this.document.body.classList.remove('boxed');
                }

                for(const className of this.document.body.classList) {
                    if (className.startsWith('theme-')) {
                        this.document.body.classList.remove(className);
                    }
                }

                this.document.body.classList.add(this.fuseConfig.colorTheme);
            });

        // Server side token validation TODO: Temporary fix
        this._deviceprovisioningService.fetchAllRequestsAndDeviceCount(this.filters).subscribe((res) => { });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }
}
