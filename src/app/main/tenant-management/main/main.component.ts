import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { TenantsService } from '../tenants.service';
import { ContactsMainSidebarComponent } from 'app/main/device-provisioning/sidebars/main/main.component';



@Component({
  selector: 'tenant-main-sidebar',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class TenantMainSidebarComponent implements OnInit, OnDestroy {

  tenantsList: any[];
  tenantStatus : any[];
  uCount: number;
  gCount: number;
  iCount: number;
  csCount: number;
  sCount: number;
  dsCount: number;
  esCount: number;
  disCount: number;
  ukCount: number;
  others :number;
  chartData: any;
  hchartData: any;
  chartLabels: any[];
  hchartLabels: any[];
  keys=[];
  chartDatasets = [{ data: [0, 0, 0] }];
  hchartDatasets = [{ data: [0, 0, 0, 0, 0] }];
  public chartType: string = 'doughnut';
  public hchartType: string = 'horizontalBar';

  public chartColors: Array<any> = [
    {
      backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C'],
      hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870'],
      borderWidth: 2,
    }
  ];
  public chartOptions: any = {
    responsive: true
  };



  public hchartColors: Array<any> = [
    {
      backgroundColor: [
        '#F89419',
        '#4CC957',
        '#0877CA',
        '#e82026',
        '#023a64'
        
      ],
      borderColor: [
        '#F89419',
        '#4CC957',
        '#0877CA',
        '#e82026',
        '#023a64'
      ],
      borderWidth: 1,
    }
  ];

  public hchartOptions: any = {
    responsive: true
  };


  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {ContactsService} _contactsService
     
   */
  constructor(private _tenantsService: TenantsService
  ) {
    // Set the private defaults

    this._unsubscribeAll = new Subject();   
    this.hchartLabels = ['Created', 'Enabled', 'Suspended', 'Deleted', 'Disabled'];

  }

  ngOnInit(): void {


    this._tenantsService.fetchAllTenants()
      .subscribe(
        (res: any) => {
          this.tenantsList = res.data.tenants.filter(item =>
            item.Status === 'ENABLED' || item.Status === 'CREATED'
        );

        this.tenantStatus =res.data.tenants;
        console.log(this.tenantsList);
          this.uCount = this.tenantsList.filter(e => e.Address.Country && e.Address.Country.toString().toLowerCase() == "us").length;
          this.gCount = this.tenantsList.filter(e => e.Address.Country && e.Address.Country.toString().toLowerCase() == "germany").length;
          this.iCount = this.tenantsList.filter(e => e.Address.Country && e.Address.Country.toString().toLowerCase() == "india").length;
          this.ukCount = this.tenantsList.filter(e => e.Address.Country && e.Address.Country.toString().toLowerCase() == "uk").length;
          this.csCount = this.tenantStatus.filter(e =>e.Status && e.Status.toString().toLowerCase() == "created").length;
          this.esCount = this.tenantStatus.filter(e =>e.Status && e.Status.toString().toLowerCase() == "enabled").length;
          this.sCount = this.tenantStatus.filter(e => e.Status && e.Status.toString().toLowerCase() == "suspended").length;
          this.dsCount = this.tenantStatus.filter(e =>e.Status && e.Status.toString().toLowerCase() == "deleted").length;
          this.disCount = this.tenantStatus.filter(e =>e.Status && e.Status.toString().toLowerCase() == "disabled").length;


          const countarry = [{ country: "US", count: this.uCount }, { country: "Germany", count: this.gCount }, { country: "India", count: this.iCount }, { country: "UK", count: this.ukCount }];
         
          countarry.sort(function (a, b) {
            if (a.count !== b.count) {
              return b.count - a.count;
            }
          });


          this.chartDatasets = [{ data: [countarry[0].count, countarry[1].count, countarry[2].count, countarry[3].count] }];

          this.chartLabels = [countarry[0].country, countarry[1].country, countarry[2].country, 'Others']

          this.hchartDatasets = [{ data: [this.csCount, this.esCount, this.sCount, this.dsCount, this.disCount] }];

        }
      );
  }

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


}
