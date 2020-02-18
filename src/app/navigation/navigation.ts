import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    // {
    //     id       : 'dashboard',
    //     title    : 'Dashboard',
    //     translate: 'Dashboard',
    //     type     : 'item',
    //     icon     : 'assets/images/icons/Dashboard.png',
    //     url      : '/analytics'
    // },           
    {
        id: 'deviceProvisioning',
        title: 'Device Provisioning',
        translate: 'Device Provisioning',
        type: 'item',
        icon: 'assets/images/icons/Provisioning.png',
        url: '/device-provisioning'
    },
    {
        id: 'devicesManagement',
        title: 'Device Management',
        translate: 'Device Management',
        type: 'collapsable',
        icon: 'dvr',
        url: '/device-management',
        children : [
            {
                id   : 'firmwareRelease',
                title: 'Firmware Release',
                type : 'item',
                url  : '/firmware'
            },
            {
                id   : 'fota',
                title: 'FOTA',
                type : 'item',
                url  : '/fota'
            }]
       
    },
    // {
    //     id: 'firmwareRelease',
    //     title: 'Firmware Release',
    //     translate: 'Firmware Release',
    //     type: 'item',
    //     icon: 'assets/images/icons/Firmware.png',
    //     url: '/firmware'
        
    // }
    // ,
    {
        id: 'tenantsManagement',
        title: 'Tenants Management',
        translate: 'Tenants Management',
        icon: 'business',
        type: 'collapsable',
        url: '/tenant-management',

        children : [
            {
                id   : 'createTenant',
                title: 'Create Tenant',
                type : 'item',
                url  : '/CreateTenant'
            }]
        
    }
    // ,
    // {
    //     id: 'createTenant',
    //     title: 'Create Tenant',
    //     translate: 'Create Tenant',
    //     icon: 'assets/images/icons/CreateTenantManage.png',
    //     type: 'item',
    //     url: '/CreateTenant',
       
    // }
];
