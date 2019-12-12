import {Type} from '@angular/core';
import {ValidatorFn} from '@angular/forms';

export abstract class AbstractType<T> {
  public abstract readonly component: Type<any>;

  public abstract get validators(): ValidatorFn[];

  constructor(public options: T,
  ) {
  }
}
