import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Provision } from 'app/main/device-provisioning/device-provisioning.model';

@Component({
    selector     : 'device-provisioning-form-dialog',
    templateUrl  : './device-provisioning.component.html',
    styleUrls    : ['./device-provisioning.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class deviceprovisioningFormDialogComponent
{
    action: string;
    contact: Provision;
    contactForm: FormGroup;
    dialogTitle: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<deviceprovisioningFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<deviceprovisioningFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit Contact';
            this.contact = _data.contact;
        }
        else
        {
            this.dialogTitle = 'New Contact';
            this.contact = new Provision({});
        }

      //  this.contactForm = this.createContactForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create contact form
     *
     * @returns {FormGroup}
     */
    createContactForm()
    {
        
    }
}
