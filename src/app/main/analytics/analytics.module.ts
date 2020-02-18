import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';

import { AnalyticsComponent } from './analytics.component';
import { AnalyticsService } from 'app/main/analytics/analytics.service';

const routes = [
  {
    path: 'analytics',
    component: AnalyticsComponent,
    resolve: { data: AnalyticsService }
  }
];

@NgModule({
  declarations: [
    AnalyticsComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatTabsModule,

    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
    }),
    ChartsModule,
    NgxChartsModule,

    FuseSharedModule,
    FuseWidgetModule,
    CommonModule
  ],
  exports: [
    AnalyticsComponent
  ],
  providers: [
    AnalyticsService
  ]
})
export class AnalyticsModule {

}
