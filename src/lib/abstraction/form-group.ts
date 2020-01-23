import * as ng from '@angular/forms';
import {InitHandler} from './init-handler';

export class FormGroup extends ng.FormGroup {

  public readonly initHandler: InitHandler<FormGroup> = new InitHandler<FormGroup>(this);

  public updateValueAndValidity(opts?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    if (!this.initHandler || this.initHandler.isInitialized) {
      super.updateValueAndValidity(opts);
    }
  }
}
