import {AbstractGroupType, IGroupTypeOptions} from '../form-type/abstract-group-type';
import {FormModel} from '../form-type/abstract-type';
import {EventEmitter, QueryList} from '@angular/core';
import {FormSlotDirective} from '../form-slot/form-slot.directive';
import {FormGroup} from './form-group';
import {FormArray} from './form-array';
import {ValidationErrors} from '@angular/forms';

export interface IFormBuilder<T extends { [key: string]: any } = {}> {
  fieldType: AbstractGroupType<IGroupTypeOptions<T>, T>;
  mwFormModel: FormModel<T>;
  mwFormData: T;
  mwFormSubmit: EventEmitter<T>;
  mwSlots: QueryList<FormSlotDirective>;
  group: FormGroup;
  readonly valid: boolean;
  readonly invalid: boolean;

  rebuildForm(): void;

  submit(): T;

  getErrors(group?: FormGroup | FormArray): { [key: string]: ValidationErrors } | ValidationErrors[] | null;
}
