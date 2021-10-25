import {AbstractFormFieldComponent} from './abstract-form-field/abstract-form-field.component';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {AbstractControl} from '@angular/forms';
import {AbstractType} from './form-type/abstract-type';
import {OnChanges, SimpleChange} from '@angular/core';

export class FieldInstanceHelper {
  public static setupFieldInstance(instance: AbstractFormFieldComponent<any>, data: {
    mwFormGroup: any;
    mwElement: FormControl | FormArray | FormGroup | AbstractControl;
    mwFieldType: AbstractType<any>;
    mwPath: string;
    mwIndex?: number;
  }): void {
    const changes = {
      mwFormGroup: new SimpleChange(null, data.mwFormGroup, true),
      mwElement: new SimpleChange(null, data.mwElement, true),
      mwFieldType: new SimpleChange(null, data.mwFieldType, true),
      mwPath: new SimpleChange(null, data.mwPath, true),
      mwIndex: new SimpleChange(null, data.mwIndex, true),
    };

    instance.mwFormGroup = changes.mwFormGroup.currentValue;
    instance.mwElement = changes.mwElement.currentValue;
    instance.mwFieldType = changes.mwFieldType.currentValue;
    instance.mwPath = changes.mwPath.currentValue;
    instance.mwIndex = changes.mwIndex.currentValue;

    if ('ngOnChanges' in instance) {
      (instance as any as OnChanges).ngOnChanges(changes);
    }
  }

}
