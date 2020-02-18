import { NgModule, ModuleWithProviders } from '@angular/core';
import { ConvertStatus } from './pipes/convert-status.pipe';
import { StatusIcon } from './pipes/status-icon.pipe';
import { TenantStatusPipePipe } from './pipes/tenant-status-pipe.pipe';
import { TenantStatusIconPipePipe } from './pipes/tenant-status-icon-pipe.pipe';

@NgModule({
  declarations: [ConvertStatus, StatusIcon, TenantStatusPipePipe, TenantStatusIconPipePipe],
  exports: [
    ConvertStatus,
    StatusIcon,
    TenantStatusPipePipe,
    TenantStatusIconPipePipe
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
