import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DevicesService } from 'app/main/device-management/devices.service';

@Component({
  selector: 'devices-main-sidebar',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class DevicesMainSidebarComponent implements OnInit, OnDestroy {

  chartData: any = {};
  dataSource: any;

  public hchartType = 'horizontalBar';
  public hchartDatasets: Array<any> = [{ data: [] }];
  public hchartLabels: Array<any> = [];
  public hchartColors: Array<any> = [{
    borderColor: ['#0876CB', '#4DC758', '#F79321', '#G79321', '#E52125', '#Z79321', '#EZ2125'],
    backgroundColor: ['#0876CB', '#4DC758', '#F79321', '#G79321', '#E52125', '#Z79321', '#EZ2125'],
    borderWidth: 2,
  }];

  
  public hchartOptions: any = {
    responsive: true,
    scales: {
      xAxes: [{ ticks: { fontSize: 10, beginAtZero: true }, gridLines: { color: 'rgba(0, 0, 0, 0)' } }],
      yAxes: [{ ticks: { fontSize: 10 }, gridLines: { color: 'rgba(0, 0, 0, 0)' } }]
    }
  };

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(private _devicesService: DevicesService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {   
    this._devicesService.onDevicesDataChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(data => {
        
        if (JSON.stringify(this.chartData) === JSON.stringify(data)) {
          return;
        }
        const currentTenent = localStorage.getItem('managementSelectedTenent') || '';      
        this.chartData = data;
        this.hchartLabels = [...new Set(data.map(e => e.status))];
        this.hchartDatasets = [{ data: [...new Set(data.map(e => e.count))], label: currentTenent }];
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
