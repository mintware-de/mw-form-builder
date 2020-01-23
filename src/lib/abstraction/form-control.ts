import * as ng from '@angular/forms';
import {InitHandler} from './init-handler';

export class FormControl extends ng.FormControl {

  public readonly initHandler: InitHandler<FormControl> = new InitHandler<FormControl>(this);

  public updateValueAndValidity(opts?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    if (!this.initHandler || this.initHandler.isInitialized) {
      super.updateValueAndValidity(opts);
    }
  }
}
