import {FormModel} from './form-builder/form-builder.component';
import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';
import {AbstractCollectionType} from './form-type/abstract-collection-type';
import {AbstractGroupType} from './form-type/abstract-group-type';
import {AbstractType} from './form-type/abstract-type';

export class ModelHandler {
  public static build(model: FormModel): FormGroup {
    const group = new FormGroup({});
    this.handleModel(model, group);
    return group;
  }

  private static handleModel(model: FormModel, group: FormGroup): void {
    Object.keys(model).forEach((name) => {
      const field = model[name];
      if (field != null) {
        const control = ModelHandler.handleField(field);
        group.addControl(name, control);
      }
    });
  }

  private static handleField(field: AbstractCollectionType<any, any> | AbstractGroupType<any> | AbstractType<any>): AbstractControl {
    let component: AbstractControl;
    if (field instanceof AbstractCollectionType) {
      component = new FormArray([], field.validators);
      ModelHandler.handleArray(field as AbstractCollectionType<any, any>, component as FormArray);
    } else if (field instanceof AbstractGroupType) {
      component = new FormGroup({}, field.validators);
      ModelHandler.handleModel(field.options.model, component as FormGroup);
    } else {
      component = new FormControl(null, field.validators);
    }
    return component;
  }

  private static handleArray(field: AbstractCollectionType<any, any>, array: FormArray): void {
    array.push(ModelHandler.handleField(field.fieldInstance));
  }
}
