import * as ng from '@angular/forms';
import {InitHandler} from './init-handler';

export class FormArray extends ng.FormArray {

  public readonly initHandler: InitHandler<FormArray> = new InitHandler<FormArray>(this);

  public updateValueAndValidity(opts?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    if (!this.initHandler || this.initHandler.isInitialized) {
      super.updateValueAndValidity(opts);
    }
  }
}
