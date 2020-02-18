import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tenantStatusPipe'
})
export class TenantStatusPipePipe implements PipeTransform {

  transform(value: string): string {
    if (value === 'CREATED') { return 'Created'; }
    if (value === 'ENABLED') { return 'Enabled'; }
    if (value === 'DISABLED') { return 'Disabled'; }
    if (value === 'SUSPENDED' ) { return 'Suspended'; }
    if (value === 'DELETED' ) { return 'Deleted'; }
    return value;
  }
}