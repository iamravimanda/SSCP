import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ErrorComponent implements OnInit {
    errorCode: string;
    errorMessage: string;
    constructor(private route: ActivatedRoute) {

    }
    ngOnInit(): void {
        this.errorCode = this.route.snapshot.paramMap.get("code");
        switch (this.errorCode) {
            case '404':
                this.errorMessage = 'Sorry but we could not find the page you are looking for';
                break;

            case '500':
                this.errorMessage = 'Internal Server Error: Looks like we have an internal issue, please try again in couple minutes';
                break;

            case '502':
                this.errorMessage = 'Bad Gateway: ';
                break;

            default:
                this.errorMessage = 'Looks like we have an internal issue, please try again in couple minutes';

        }
    }
}

