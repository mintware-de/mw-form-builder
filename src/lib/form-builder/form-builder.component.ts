import {Component, ContentChildren, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges} from '@angular/core';
import {FormArray, FormControl, FormGroup, ValidationErrors} from '@angular/forms';
import {AbstractType} from '../form-type/abstract-type';
import {FormSlotComponent} from '../form-slot/form-slot.component';
import {ModelHandler} from '../model-handler';
import {AbstractGroupType} from '../form-type/abstract-group-type';
import {AbstractCollectionType} from '../form-type/abstract-collection-type';

export interface FormModel {
  [key: string]: AbstractType<any>;
}

@Component({
  selector: 'mw-form-builder',
  template: `
    <ng-content></ng-content>
    <form [formGroup]="group" (ngSubmit)="submit()" #form>
      <mw-form-group #fromGroup [element]="group" [formGroup]="group" [model]="formModel" [slots]="slots">
      </mw-form-group>
    </form>
  `,
  styles: []
})
export class FormBuilderComponent implements OnInit, OnChanges {

  @Input()
  public formModel: FormModel;

  @Input()
  public formData: { [key: string]: any };

  @Output()
  public onSubmit: EventEmitter<any> = new EventEmitter<any>();

  @ContentChildren(FormSlotComponent, {descendants: true})
  public slots: QueryList<FormSlotComponent>;

  public group: FormGroup;

  public ngOnInit(): void {
    this.rebuildForm();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('formModel') && changes.formModel.currentValue != null) {
      this.rebuildForm();
    }
    if (changes.hasOwnProperty('formData') && changes.formData.currentValue != null) {
      if (!changes.hasOwnProperty('formModel')) {
        this.initializeCollectionFields(this.group, this.formModel, this.formData);
      }
      if (this.group != null) {
        this.group.patchValue(this.formData);
      }
    }
  }

  public rebuildForm(): void {
    let res = {};
    if (this.group != null) {
      res = Object.assign({}, this.group.value);
    } else if (this.formData != null) {
      res = Object.assign({}, this.formData);
    }

    this.buildForm();
    this.initializeCollectionFields(this.group, this.formModel, res);

    if (this.group != null) {
      this.group.patchValue(res);
    }
  }

  private initializeCollectionFields(group: FormGroup, model: FormModel, data: any): void {
    Object.keys(model).forEach((name) => {
      const formType = model[name];
      const childData = data.hasOwnProperty(name) ? data[name] : null;

      const control = group.get(name);
      if (formType instanceof AbstractGroupType) {
        this.initializeCollectionFields(control as FormGroup, (formType as AbstractGroupType<any>).options.model, childData);
      } else if (formType instanceof AbstractCollectionType) {
        this.initializeCollectionField(formType, control as FormArray, childData);
      }
    });
  }

  private initializeCollectionField(collection: AbstractCollectionType<any, any>, array: FormArray, data?: Array<any>): void {
    const numberOfEntries = Array.isArray(data) ? data.length : 0;
    if (array.clear != null) {
      array.clear();
    }
    if (numberOfEntries === 0) {
      return;
    }

    const isGroup = collection.fieldInstance instanceof AbstractGroupType;
    const isCollection = !isGroup && collection.fieldInstance instanceof AbstractCollectionType;
    const isFormField = !isCollection && collection.fieldInstance instanceof AbstractType;

    for (let i = 0; i < numberOfEntries; i++) {
      if (isGroup) {
        const childModel = (collection.fieldInstance as AbstractGroupType<any>).options.model;
        const childFormGroup = ModelHandler.build(childModel);
        childFormGroup.setParent(array);
        this.initializeCollectionFields(childFormGroup, childModel, data[i]);
        array.controls.push(childFormGroup);
      } else if (isCollection) {
        const childArray = new FormArray([], collection.fieldInstance.validators);
        childArray.setParent(array);
        this.initializeCollectionField(collection.fieldInstance as AbstractCollectionType<any, any>, childArray, data[i]);
        array.controls.push(childArray);
      } else if (isFormField) {
        array.controls.push(new FormControl(null, collection.fieldInstance.validators));
      }
    }
  }

  /**
   * This method builds the FormGroup
   */
  private buildForm(): void {
    this.group = ModelHandler.build(this.formModel);
  }


  public submit(): any {
    Object.keys(this.group.controls).forEach((field) => {
      const control = this.group.get(field);
      control.markAsDirty();
      control.updateValueAndValidity();
    });

    if (!this.group.valid) {
      return;
    }

    this.onSubmit.emit(this.group.value);

    return this.group.value;
  }

  public getErrors(group?: FormGroup | FormArray): { [key: string]: ValidationErrors } | ValidationErrors[] | null {
    const errors = group instanceof FormArray ? [] : {};

    if (group == null) {
      group = this.group;
    }

    let idx = 0;
    Object.keys(group.controls).forEach((name) => {
      idx++;
      const control = group.get(name);
      if (control instanceof FormArray || control instanceof FormGroup) {
        const tmpErrors = this.getErrors(control as (FormArray | FormGroup));
        if (tmpErrors != null) {
          errors[name] = tmpErrors;
        }
      } else if (control instanceof FormControl) {
        if (control.errors == null) {
          return null;
        }
        if (group instanceof FormArray) {
          (errors as ValidationErrors[])[idx] = control.errors;
        } else {
          errors[name] = control.errors;
        }
      }
    });

    return (group instanceof FormGroup && Object.keys(errors).length === 0)
    || Array.isArray(errors) && errors.length === 0 ? null : errors;
  }
}
