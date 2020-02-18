import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { FuseSharedModule } from '@fuse/shared.module';

import { MatSnackBarModule } from '@angular/material';
import { ErrorComponent } from './error.component';

const routes = [
    {
        path: 'error/:code',
        component: ErrorComponent
    },
];

@NgModule({
    declarations: [
        ErrorComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MatSnackBarModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        FuseSharedModule
    ]
})
export class ErrorModule {
}
