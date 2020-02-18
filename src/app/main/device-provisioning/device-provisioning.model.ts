import { FuseUtils } from '@fuse/utils';

export class Provision
{
    id: string;
    Companyname: string;
    FileName: string;
    Date: any;
    Status: string;  
    /**
     * Constructor
     *
     * @param provision
     */
    constructor(Provision)
    {
        {
            this.id = Provision.id 
            this.Companyname = Provision.Companyname || '';
            this.FileName = Provision.FileName || '';
            this.Date = Provision.Date || 'assets/images/avatars/profile.jpg';
            this.Status = Provision.Status || '';
          
        }
    }
}