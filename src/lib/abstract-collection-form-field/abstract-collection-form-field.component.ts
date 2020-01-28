import {AbstractCollectionType} from '../form-type/abstract-collection-type';
import {AbstractFormFieldComponent} from '../abstract-form-field/abstract-form-field.component';
import {AbstractGroupType} from '../form-type/abstract-group-type';
import {ModelHandler} from '../model-handler';
import {FormArray, FormControl, FormGroup} from '../abstraction';

export abstract class AbstractCollectionFormFieldComponent extends AbstractFormFieldComponent<AbstractCollectionType<any, any>> {

  public removeEntry(index: number): void {
    (this.element as FormArray).removeAt(index);
  }

  public addEntry(): void {
    let newControl: FormArray | FormControl | FormGroup;
    if (this.fieldType.fieldInstance instanceof AbstractGroupType) {
      const field = ModelHandler.build(this.fieldType.fieldInstance.options.model, this.fieldType.builderInstance);
      field.setParent(this.element as FormArray);
      newControl = field;
    } else if (this.fieldType.fieldInstance instanceof AbstractCollectionType) {
      newControl = new FormArray([], this.fieldType.fieldInstance.controlOptions);
    } else {
      newControl = new FormControl(null, this.fieldType.fieldInstance.controlOptions);
    }
    newControl.initHandler.setIsInitialized(true);
    (this.element as FormArray).controls.push(newControl);
  }
}
