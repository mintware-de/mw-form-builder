import * as ng from '@angular/forms';

export class FormArray extends ng.FormArray {

  get isInitialized(): boolean {
    return this._isInitialized;
  }

  set isInitialized(value: boolean) {
    const ripple = this._isInitialized !== value;
    this._isInitialized = value;

    if (ripple) {
      Object.keys(this.controls).forEach((k) => (this.controls[k] as any).isInitialized = value);
    }
  }

  // tslint:disable-next-line:variable-name
  private _isInitialized: boolean = false;

  public updateValueAndValidity(opts?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    if (this._isInitialized) {
      super.updateValueAndValidity(opts);
    }
  }
}
