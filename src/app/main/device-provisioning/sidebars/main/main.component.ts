import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { deviceprovisioningService } from 'app/main/device-provisioning/device-provisioning.service';
import { DeviceProvisionFilter } from 'app/shared/Filters/Filters';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'contacts-main-sidebar',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class ContactsMainSidebarComponent implements OnInit, OnDestroy {
    user: any;
    filterBy: string;
    acount: number;
    scount: number;
    pscount: number;
    rcount: number;
    fcount: number;
    dcount = 0;
    dacount: number;
    dscount: number;
    dpscount: number;
    drcount: number;
    dfcount: number;
    dataSource: any;
    chartData: any;
    showDataLabel: any;
    barChartData: any[];
    barChartLegend: boolean = false;
    isfilter: boolean = false;
    lastWorkingDay: Date = new Date();
    todate1 = this.lastWorkingDay.setDate(this.lastWorkingDay.getDate() - 7);
    fdate = this.lastWorkingDay;
    tdate = new Date();
    filters: DeviceProvisionFilter = {
        tenantId: '',
        skip: 0,
        take: 10,
        status: 'all',
        fromDate: '',
        toDate: '',
        tenantSCode : '',
        fileName: '',
        dpStatus: '',
    }

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ContactsService} _contactsService
       
     */
    constructor(private _deviceprovisioningService: deviceprovisioningService, public datepipe: DatePipe) {
        // Set the private defaults

        this._unsubscribeAll = new Subject();
        this.barChartData = [{ data: [0,  0, 0] }];
        this.chartData = {
            chartType: 'bar',
            datasets: [{ data: [0, 0, 0, 0] }],

            labels: ['Success', 'Received', 'Failed'],
            colors: [{
                borderColor: ['#4DC758',  '#F79321', '#E52125'],
                backgroundColor: ['#4DC758',  '#F79321', '#E52125']
            }],
            options: {
                spanGaps: false,

                maintainAspectRatio: false,
                layout: { padding: { top: 24, left: 16, right: 16, bottom: 24 } }

            }
        };
    }

    ngOnInit(): void {

        const fromDate = this.datepipe.transform(this.fdate, 'yyyy-MM-dd');
        const toDate = this.datepipe.transform(this.tdate, 'yyyy-MM-dd');
        this.filters.fromDate = fromDate;
        this.filters.toDate = toDate;

        this._deviceprovisioningService.onProvisionsDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(provisions => {
                this.dataSource = provisions;
                this.getCounts();
            });

        this._deviceprovisioningService.onSearchTextChanged
            .subscribe(searchText => {
                if (this.filters.status != '') {
                    this.filterBy = 'all';
                    this.isfilter = false;
                }
                this.filters.fromDate = this.datepipe.transform(searchText.fromDate, 'yyyy-MM-dd');
                this.filters.toDate = this.datepipe.transform(searchText.toDate, 'yyyy-MM-dd');
                this.filters.tenantId = searchText.search;
                this.filters.status = searchText.dpStatus;
                this.getCounts();
                
            });

    }

    getCounts() {
        this._deviceprovisioningService.fetchAllRequestsAndDeviceCount(this.filters).subscribe((res) => {            
            if (!this.isfilter) {          
                this.acount = res.data.totalNoRequests;
                this.scount = res.data.requestStatusCount.SuccessfullyProvisioned;
                this.pscount = res.data.requestStatusCount.PartiallySuccessful;
                this.fcount = res.data.requestStatusCount.FailedProvisioning;
                this.rcount = res.data.requestStatusCount.RequestProcessing + res.data.requestStatusCount.RequestReceived;
              //  this.dcount = res.data.requestStatusCount.DeProvisioned;
                this.dcount = 0;
            }
            this.dscount = res.data.deviceStatusCount.SuccessfullyProvisioned;
            this.dpscount = res.data.deviceStatusCount.PartiallyProcessed;
            this.dfcount = res.data.deviceStatusCount.FailedProvisioning;
            this.drcount = res.data.deviceStatusCount.RequestProcessing + res.data.deviceStatusCount.RequestReceived;
            this.barChartData = [{ data: [this.dscount,  this.drcount, this.dfcount] }];
            this.chartData.datasets[0].data[0] = this.dscount;
            this.chartData.datasets[0].data[1] = this.dpscount;
            this.chartData.datasets[0].data[2] = this.drcount;
            this.chartData.datasets[0].data[3] = this.dfcount;
        },

            err => {  
               
                    this.acount = 0
                    this.scount = 0
                    this.pscount = 0
                    this.fcount = 0
                    this.rcount = 0
    
                    this.dscount = 0
                    this.dpscount = 0
                    this.dfcount = 0
                    this.drcount = 0            
                
                // this.barChartData = [{ data: [this.dscount, this.dpscount, this.drcount, this.dfcount] }];
                // this.chartData.datasets[0].data[0] = this.dscount;
                // this.chartData.datasets[0].data[1] = this.dpscount;
                // this.chartData.datasets[0].data[2] = this.drcount;
                // this.chartData.datasets[0].data[3] = this.dfcount;

                this.barChartData = [{ data: [0, 0, 0, 0] }];
                this.chartData.datasets[0].data[0] = 0;
                this.chartData.datasets[0].data[1] = 0;
                this.chartData.datasets[0].data[2] = 0;
                this.chartData.datasets[0].data[3] = 0;
            })
        };


    

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Change the filter
     *
     * @param filter
     */
    changeFilter(filter, intef): void {        
        this.filterBy = filter;
        this.filters.status = filter;
        this.isfilter = true;
        if(intef !=0) 
        {
         this.getCounts(); 
        }       
        //this._deviceprovisioningService.onFilterChanged.next(this.filterBy);
        this._deviceprovisioningService.onFilterChanged.next(this.filters);
    }

}
