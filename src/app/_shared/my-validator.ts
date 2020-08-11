import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MyValidator {
    emailValidator(email: string): boolean {
        let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    }

    mobileValidator(mobile: string): boolean {
        let regex = /^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/;
        return regex.test(mobile);
    }

    phoneValidator(phone: string): boolean {
        let regex = /^[2-9]\d{2}-\d{3}-\d{4}$/
        return regex.test(phone);
    }
}