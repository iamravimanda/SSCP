export class Provision {
    ProvisioningRequestId: string;
    UserId: string;
    TenantId: string;
    Description: string;
    FileProperties: FileProperties;
    Status: string;
    CreatedDate: Date;
    ModifiedDate: Date;
}

export class FileProperties {
    FileName: number;
    StorageLocation: string;
    CloudProvider: string;
    CloudStorage: string;
}
