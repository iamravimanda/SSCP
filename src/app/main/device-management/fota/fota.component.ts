import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { LoggedInCallback } from 'app/shared/services/cognito.tenant.service';
import { Router } from '@angular/router';

export interface PeriodicElement {
  jobName: string;
  deviceType: string;
  deviceCount: number;
  success: number;
  failed: number;
  notKnown: number;
  status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    jobName: "1",
    deviceType: "Hydrogen",
    deviceCount: 1.0079,
    success: 2,
    failed: 1,
    notKnown: 3,
    status: "Success"
  },
  {
    jobName: "2",
    deviceType: "Hydrogen",
    deviceCount: 1.0079,
    success: 2,
    failed: 1,
    notKnown: 3,
    status: "Success"
  },
  {
    jobName: "3",
    deviceType: "Hydrogen",
    deviceCount: 1.0079,
    success: 2,
    failed: 1,
    notKnown: 3,
    status: "Failed"
  },
  {
    jobName: "4",
    deviceType: "Hydrogen",
    deviceCount: 1.0079,
    success: 2,
    failed: 1,
    notKnown: 3,
    status: "Success"
  },
  {
    jobName: "5",
    deviceType: "Hydrogen",
    deviceCount: 1.0079,
    success: 2,
    failed: 1,
    notKnown: 3,
    status: "Failed"
  },
  {
    jobName: "6",
    deviceType: "Hydrogen",
    deviceCount: 1.0079,
    success: 2,
    failed: 1,
    notKnown: 3,
    status: "Running"
  },
  {
    jobName: "7",
    deviceType: "Hydrogen",
    deviceCount: 1.0079,
    success: 2,
    failed: 1,
    notKnown: 3,
    status: "Running"
  },
  {
    jobName: "8",
    deviceType: "Hydrogen",
    deviceCount: 1.0079,
    success: 2,
    failed: 1,
    notKnown: 3,
    status: "Success"
  },
  {
    jobName: "9",
    deviceType: "Hydrogen",
    deviceCount: 1.0079,
    success: 2,
    failed: 1,
    notKnown: 3,
    status: "Running"
  },
  {
    jobName: "10",
    deviceType: "Hydrogen",
    deviceCount: 1.0079,
    success: 2,
    failed: 1,
    notKnown: 3,
    status: "Failed"
  },
  {
    jobName: "11",
    deviceType: "Hydrogen",
    deviceCount: 1.0079,
    success: 2,
    failed: 1,
    notKnown: 3,
    status: "Running"
  }
];

@Component({
  selector: 'app-fota',
  templateUrl: './fota.component.html',
  styleUrls: ['./fota.component.scss']
})
export class FOTAComponent implements LoggedInCallback, OnInit {
  displayedColumns: string[] = [
    "jobName",
    "deviceType",
    "deviceCount",
    "success",
    "failed",
    "notKnown",
    "status"
  ];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor( public router: Router) { }
  
  isLoggedIn(message: string, isLoggedIn: boolean): void {
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }
  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
