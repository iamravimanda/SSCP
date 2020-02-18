import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'statusIcon' })
export class StatusIcon implements PipeTransform {
    transform(value: string): string {
        if (value === 'SuccessfullyProvisioned') { return 'assets/icons/status-icons/Success.png'; }
        if (value === 'FailedProvisioning') { return 'assets/icons/status-icons/Fail.png'; }
        if (value === 'RequestProcessing' || value === 'RequestReceived') { return 'assets/icons/status-icons/Received.png'; }
        if (value === 'PartiallyProcessed' || value === 'PartiallySuccessful') { return 'assets/icons/status-icons/PS.png'; }
        return value;
    }
}
