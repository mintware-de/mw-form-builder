import {Input} from '@angular/core';
import {AbstractControl, FormArray, FormGroup} from '@angular/forms';
import {AbstractType} from '../form-type/abstract-type';

export abstract class AbstractFormFieldComponent<T extends AbstractType<any>> {

  @Input()
  public formGroup: FormGroup;

  @Input()
  public fieldName: string;

  @Input()
  public arrayName: string;

  @Input()
  public fieldType: T;

  public get identifier(): string {
    if (!this.isArrayElement) {
      return this.fieldName;
    }
    return `${this.arrayName}_${this.fieldName}`;
  }

  public get el(): AbstractControl {
    if (this.isArrayElement) {
      return (this.formGroup.get(this.arrayName) as FormArray).at(Number(this.fieldName));
    }
    return this.formGroup.get(this.fieldName);
  }

  public get isArrayElement(): boolean {
    return this.arrayName != null && this.arrayName !== '';
  }
}
