import {FormBuilderComponent, FormModel} from './form-builder/form-builder.component';
import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';
import {AbstractCollectionType} from './form-type/abstract-collection-type';
import {AbstractGroupType} from './form-type/abstract-group-type';
import {AbstractType} from './form-type/abstract-type';

export class ModelHandler {
  public static build(model: FormModel, builderInstance: FormBuilderComponent): FormGroup {
    const group = new FormGroup({});
    this.handleModel(model, group, builderInstance);
    return group;
  }

  private static handleModel(model: FormModel, group: FormGroup, builderInstance: FormBuilderComponent): void {
    Object.keys(model).forEach((name) => {
      const field = model[name];
      if (field != null) {
        const control = ModelHandler.handleField(field, builderInstance);
        control.setParent(group);

        if (field.disabled) {
          control.disable();
        }

        group.addControl(name, control);
        if (field.builderInstance == null && builderInstance != null) {
          field.builderInstance = builderInstance;
        }
      }
    });
  }

  private static handleField(field: AbstractType<any>, builderInstance: FormBuilderComponent): AbstractControl {
    let component: AbstractControl;
    if (field instanceof AbstractCollectionType) {
      component = new FormArray([], field.validators);
      ModelHandler.handleArray(field as AbstractCollectionType<any, any>, component as FormArray, builderInstance);
    } else if (field instanceof AbstractGroupType) {
      component = new FormGroup({}, field.validators);
      ModelHandler.handleModel(field.options.model, component as FormGroup, builderInstance);
    } else {
      component = new FormControl({value: null, disabled: field.disabled}, field.validators);
    }
    return component;
  }

  private static handleArray(field: AbstractCollectionType<any, any>, array: FormArray, builderInstance: FormBuilderComponent): void {
    array.push(ModelHandler.handleField(field.fieldInstance, builderInstance));
  }
}
