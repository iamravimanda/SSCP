import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'convertStatus' })
export class ConvertStatus implements PipeTransform {
  transform(value: string): string {
    if (value === 'SuccessfullyProvisioned') { return 'Success'; }
    if (value === 'FailedProvisioning') { return 'Failed'; }
    if (value === 'RequestReceived' || value === 'RequestProcessing') { return 'Received'; }
    if (value === 'PartiallySuccessful' || value ==='PartiallyProcessed') { return 'Partial Success'; }
    if (value === 'De-Provisioned' ) { return 'De-Provisioned'; }
    return value;
  }
}
