import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tenantStatusIconPipe'
})
export class TenantStatusIconPipePipe implements PipeTransform {

  transform(value: string): string {
    if (value === 'CREATED') { return 'assets/icons/status-icons/Created.png'; }
    if (value === 'ENABLED') { return 'assets/icons/status-icons/Enabled.png'; }
    if (value === 'DISABLED' ) { return 'assets/icons/status-icons/Disable.png'; }
    if (value === 'SUSPENDED' ) { return 'assets/icons/status-icons/Suspended.png'; }
    if (value === 'DELETED' ) { return 'assets/icons/status-icons/Delete.png'; }

    return value;
}

}
