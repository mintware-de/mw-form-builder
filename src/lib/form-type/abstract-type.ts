import {AbstractControlOptions, AsyncValidatorFn, ValidatorFn} from '@angular/forms';
import {AbstractFormControl, Constructor} from '../types';
import {AbstractGroupType, IGroupTypeOptions} from './abstract-group-type';
import {AbstractLayoutType} from './abstract-layout-type';
import {IFormBuilder} from '../abstraction';


export type FormModel<T = any> =
  { [p in keyof T]?: AbstractGroupType<IGroupTypeOptions<p>, p> | AbstractType<any> } |
  { [p in Exclude<string, keyof T>]: AbstractLayoutType<IGroupTypeOptions<T>, T> }
  ;

export abstract class AbstractType<T> {
  public abstract readonly component: Constructor;

  public builderInstance: IFormBuilder;

  public control: AbstractFormControl;

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
