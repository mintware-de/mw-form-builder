import {AbstractCollectionType} from '../form-type/abstract-collection-type';
import {AbstractFormFieldComponent} from '../abstract-form-field/abstract-form-field.component';
import {ModelHandler} from '../model-handler';
import {FormArray} from '../abstraction';
import {Input} from '@angular/core';

// noinspection JSUnusedGlobalSymbols
export abstract class AbstractCollectionComponent extends AbstractFormFieldComponent<AbstractCollectionType<any, any>> {

  @Input()
  public mwElement: FormArray;

  // noinspection JSUnusedGlobalSymbols
  public removeEntry(index: number): void {
    this.mwElement.removeAt(index);
  }

  // noinspection JSUnusedGlobalSymbols
  public addEntry(): void {
    const newControl = ModelHandler.buildSingleField(
      this.mwFieldType.fieldInstance,
      this.mwFieldType.builderInstance
    );

    if (!newControl) {
      return;
    }

    newControl.initHandler.setIsInitialized(true);
    this.mwElement.controls.push(newControl);
  }
}
