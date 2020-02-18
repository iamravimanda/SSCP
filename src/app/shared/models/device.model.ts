export class Devices {
    ProvisioningDetailId: string;
    DeviceId: string;
    Version: string;
    DeviceType: string;
    DeviceGroup: string;
    TenantId: string;
    ProvisioningRequestId: string;
    Description: string;
    ProvisionedDetails: ProvisionedDetails;
    Status: string;
    CreatedDate: Date;
    ModifiedDate: Date;
}

export class ProvisionedDetails {
    CloudGatewayUrl: string;
    Certificate: string;
    PrivateKey: string;
    CloudProvider: string;
    RootCA: string;
    ClientCertificate: string;
    ClientPrivateKey: string;
    MqttEndpoint: string;
}
export class Device {   
    DeviceId: string;
    Version: string;
    DeviceType: string;
    DeviceGroup: string;
    TenantId: string;
    HealthStatus:string;
    DataMeter:string; 
    isSelected:boolean=false;   
}