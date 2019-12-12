import {Input} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {AbstractCollectionType} from '../form-type/abstract-collection-type';

export abstract class AbstractCollectionFormFieldComponent {

  @Input()
  public formGroup: FormGroup;

  @Input()
  public fieldName: string;

  @Input()
  public fieldType: AbstractCollectionType<any, any>;

  public get el(): FormArray {
    return this.formGroup.get(this.fieldName) as FormArray;
  }

  public removeEntry(index: number): void {
    this.el.removeAt(index);
  }

  public addEntry(): void {
    this.el.push(new FormControl(null, this.fieldType.fieldInstance.validators));
  }
}
