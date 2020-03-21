import {Input, QueryList} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';
import {AbstractType} from '../form-type/abstract-type';
import {FormSlotDirective} from '../form-slot/form-slot.directive';

export abstract class AbstractFormFieldComponent<T extends AbstractType<any>> {

  @Input()
  public mwFormGroup: FormGroup;

  @Input()
  public mwElement: FormControl | FormArray | FormGroup | AbstractControl;

  @Input()
  public mwIndex: number;

  @Input()
  public mwFieldType: T;

  @Input()
  public mwPath: string;

  @Input()
  public mwSlots: QueryList<FormSlotDirective>;
}
