import {Input, QueryList} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';
import {AbstractType} from '../form-type/abstract-type';
import {FormSlotComponent} from '../form-slot/form-slot.component';

export abstract class AbstractFormFieldComponent<T extends AbstractType<any>> {

  @Input()
  public formGroup: FormGroup;

  @Input()
  public element: FormControl | FormArray | FormGroup | AbstractControl;

  @Input()
  public index: number;

  @Input()
  public fieldType: T;

  @Input()
  public path: string;

  @Input()
  public slots: QueryList<FormSlotComponent>;
}
