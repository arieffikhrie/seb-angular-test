import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  currency: string;

  constructor() {
    this.currency = "MYR";
  }

  get() {
    return this.currency;
  }
}
