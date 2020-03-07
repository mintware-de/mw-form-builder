import {AbstractCollectionType} from '../form-type/abstract-collection-type';
import {AbstractFormFieldComponent} from '../abstract-form-field/abstract-form-field.component';
import {ModelHandler} from '../model-handler';
import {FormArray} from '../abstraction';
import {Input} from '@angular/core';

// noinspection JSUnusedGlobalSymbols
export abstract class AbstractCollectionFormFieldComponent extends AbstractFormFieldComponent<AbstractCollectionType<any, any>> {

  @Input()
  public element: FormArray;

  // noinspection JSUnusedGlobalSymbols
  public removeEntry(index: number): void {
    this.element.removeAt(index);
  }

  // noinspection JSUnusedGlobalSymbols
  public addEntry(): void {
    const newControl = ModelHandler.buildSingleField(
      this.fieldType.fieldInstance,
      this.fieldType.builderInstance
    );

    if (!newControl) {
      return;
    }

    newControl.initHandler.setIsInitialized(true);
    this.element.controls.push(newControl);
  }
}
