import {Type} from '@angular/core';
import {AsyncValidatorFn, ValidatorFn} from '@angular/forms';
import {FormBuilderComponent} from '../form-builder/form-builder.component';
import {AbstractControlOptions} from '@angular/forms/src/model';

export abstract class AbstractType<T> {
  public abstract readonly component: Type<any>;

  public builderInstance: FormBuilderComponent;

  public get asyncValidators(): AsyncValidatorFn[] {
    return null;
  }

  public get validators(): ValidatorFn[] {
    return null;
  }

  public get updateOn(): 'change' | 'blur' | 'submit' | null {
    return null;
  }

  public get disabled(): boolean {
    return false;
  }

  public get controlOptions(): AbstractControlOptions {
    return {
      asyncValidators: this.asyncValidators,
      validators: this.validators,
      updateOn: this.updateOn
    };
  }

  constructor(public options: T,
  ) {
  }
}
