import {AbstractGroupType, IGroupTypeOptions} from '../form-type/abstract-group-type';
import {FormModel} from '../form-type/abstract-type';
import {EventEmitter} from '@angular/core';
import {FormArray, FormGroup, ValidationErrors} from '@angular/forms';

export interface IFormBuilder<T extends { [key: string]: any } = {}> {
  fieldType: AbstractGroupType<IGroupTypeOptions<T>, T>;
  mwFormModel: FormModel<T>;
  mwFormData: T;
  mwFormSubmit: EventEmitter<T>;
  group: FormGroup;
  readonly valid: boolean;
  readonly invalid: boolean;

  rebuildForm(): void;

  submit(): T;

  getErrors(group?: FormGroup | FormArray): { [key: string]: ValidationErrors } | ValidationErrors[] | null;
}
