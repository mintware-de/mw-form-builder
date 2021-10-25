import {AbstractCollectionType} from './form-type/abstract-collection-type';
import {AbstractGroupType} from './form-type/abstract-group-type';
import {AbstractType, FormModel} from './form-type/abstract-type';
import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';
import {IFormBuilder} from './abstraction';
import {AbstractLayoutType} from './form-type/abstract-layout-type';

export class ModelHandler {
  public static build(model: FormModel, builderInstance: IFormBuilder): FormGroup {
    const group = new FormGroup({});
    this.handleModel(model, group, builderInstance);
    return group;
  }

  private static handleModel(model: FormModel, group: FormGroup, builderInstance: IFormBuilder): void {
    Object.keys(model).forEach((name) => {
      const field: AbstractType<any> = model[name];
      if (!field) {
        return;
      }

      if (field instanceof AbstractLayoutType) {
        this.handleModel(field.options.model, group, builderInstance);
      } else {
        const control = ModelHandler.buildSingleField(field, builderInstance);
        if (!control) {
          return;
        }
        control.setParent(group);
        if (field.disabled) {
          control.disable();
        }
        group.addControl(name, control);
        field.control = control;
      }
      if (field.builderInstance == null && builderInstance) {
        field.builderInstance = builderInstance;
      }
    });
  }

  public static buildSingleField(field: AbstractType<any>,
                                 builderInstance: IFormBuilder
  ): AbstractControl {
    let component: FormArray | FormGroup | FormControl;

    if (field instanceof AbstractCollectionType) {
      component = new FormArray([], field.controlOptions);
      ModelHandler.handleArray(field, component, builderInstance);
    } else if (field instanceof AbstractGroupType) {
      component = new FormGroup({}, field.controlOptions);
      ModelHandler.handleModel(field.options.model, component, builderInstance);
    } else if (field instanceof AbstractLayoutType) {
      // This type should not be handled
    } else if (field instanceof AbstractType) {
      component = new FormControl({value: null, disabled: field.disabled}, field.controlOptions);
    }
    return component;
  }

  private static handleArray(field: AbstractCollectionType<any, any>, array: FormArray, builderInstance: IFormBuilder): void {
    const control = ModelHandler.buildSingleField(field.fieldInstance, builderInstance);
    if (!control) {
      return;
    }
    array.push(control);
  }
}
