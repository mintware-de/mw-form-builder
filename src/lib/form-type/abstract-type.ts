import {Type} from '@angular/core';
import {ValidatorFn} from '@angular/forms';
import {FormBuilderComponent} from '../form-builder/form-builder.component';

export abstract class AbstractType<T> {
  public abstract readonly component: Type<any>;

  public builderInstance: FormBuilderComponent;

  public abstract get validators(): ValidatorFn[];

  constructor(public options: T,
  ) {
  }
}
