import {AbstractCollectionType} from '../form-type/abstract-collection-type';
import {AbstractFormFieldComponent} from '../abstract-form-field/abstract-form-field.component';
import {ModelHandler} from '../model-handler';
import {Directive, Input} from '@angular/core';
import {FormArray} from '@angular/forms';

// noinspection JSUnusedGlobalSymbols
@Directive()
export abstract class AbstractCollectionComponent<TConfig = any, T = any>
  extends AbstractFormFieldComponent<AbstractCollectionType<TConfig, T>> {

  @Input()
  public mwElement: FormArray;

  // noinspection JSUnusedGlobalSymbols
  public removeEntry(index: number): void {
    this.mwElement?.removeAt(index);
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

    this.mwElement?.push(newControl);
  }
}
