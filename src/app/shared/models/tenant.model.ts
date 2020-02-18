export class TenantList {
    TenantId: string;
    TenantCode: string;
    Name: string;
    Country: string;
    State: string;
    PrimaryContact: string;
    CreatedBy: string;
    CreatedDate: string;
    Status: string;
    isSelected = false;
}

export class TenantAddress {
    Street: string;
    Area: string;
    City: string;
    State: string;
    Country: string;
    ZipCode: number;
}

export class TenantContact {
    Name: string;
    Email: string;
    Phone: number;
    JobTitle: string;
    IsPrimary: string;
}

export class Tenant {
    TenantId: string;
    TenantCode: string;
    Name: string;
    Description: string;
    TenantShortCode: string;
    isMasterTenant: boolean;
    MasterTenantId: string;
    Address: {
        Street: string,
        Area: string,
        City: string,
        State: string,
        Country: string,
        ZipCode: number
    };
    ContactDetails: TenantContact[]
    Status: string;
}
