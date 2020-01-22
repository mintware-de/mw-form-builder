import * as ng from '@angular/forms';

export class FormControl extends ng.FormControl {

  get isInitialized(): boolean {
    return this._isInitialized;
  }

  set isInitialized(value: boolean) {
    this._isInitialized = value;
  }

  // tslint:disable-next-line:variable-name
  private _isInitialized: boolean = false;

  public updateValueAndValidity(opts?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    if (this._isInitialized) {
      super.updateValueAndValidity(opts);
    }
  }
}
