import {FormArray, FormControl} from '@angular/forms';
import {AbstractCollectionType} from '../form-type/abstract-collection-type';
import {AbstractFormFieldComponent} from '../abstract-form-field/abstract-form-field.component';
import {AbstractGroupType} from '../form-type/abstract-group-type';
import {ModelHandler} from '../model-handler';

export abstract class AbstractCollectionFormFieldComponent extends AbstractFormFieldComponent<AbstractCollectionType<any, any>> {

  public removeEntry(index: number): void {
    (this.element as FormArray).removeAt(index);
  }

  public addEntry(): void {
    if (this.fieldType.fieldInstance instanceof AbstractGroupType) {
      const field = ModelHandler.build(this.fieldType.fieldInstance.options.model);
      (this.element as FormArray).controls.push(field);
    } else if (this.fieldType.fieldInstance instanceof AbstractCollectionType) {
      (this.element as FormArray).controls.push(new FormArray([], this.fieldType.fieldInstance.validators));
    } else {
      (this.element as FormArray).controls.push(new FormControl(null, this.fieldType.fieldInstance.validators));
    }
  }
}
