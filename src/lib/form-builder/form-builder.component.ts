import {
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges
} from '@angular/core';
import {ValidationErrors} from '@angular/forms';
import {AbstractType} from '../form-type/abstract-type';
import {FormSlotComponent} from '../form-slot/form-slot.component';
import {ModelHandler} from '../model-handler';
import {AbstractGroupType} from '../form-type/abstract-group-type';
import {AbstractCollectionType} from '../form-type/abstract-collection-type';
import {FormArray, FormControl, FormGroup} from '../abstraction';

export interface FormModel {
  [key: string]: AbstractType<any>;
}

@Component({
  selector: 'mw-form-builder',
  template: `
    <ng-content></ng-content>
    <form [formGroup]="group" (ngSubmit)="submit()" #form>
      <mw-form-group #fromGroup [element]="group" [formGroup]="group" [model]="formModel" [slots]="slots" [isRootGroup]="true">
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
    if (this.group == null) {
      this.rebuildForm();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ('formModel' in changes && changes.formModel.currentValue) {
      this.rebuildForm();
    }
    if ('formData' in changes && changes.formData.currentValue) {
      if (!('formModel' in changes)) {
        this.initializeCollectionFields(this.group, this.formModel, this.formData);
        this.group.initHandler.setIsInitialized(false);
        this.group.initHandler.setIsInitialized(true);
      }
      if (this.group) {
        this.group.patchValue(this.formData);
      }
    }
  }

  public rebuildForm(): void {
    let res = {};
    if (this.group) {
      res = Object.assign({}, this.group.value);
    } else if (this.formData) {
      res = Object.assign({}, this.formData);
    }

    this.group = ModelHandler.build(this.formModel, this);
    this.initializeCollectionFields(this.group, this.formModel, res);

    if (this.group) {
      this.group.patchValue(res);
    }
  }

  private initializeCollectionFields(group: FormGroup, model: FormModel, data: any): void {
    Object.keys(model).forEach((name) => {
      const formType = model[name];
      const childData = (data && name in data) ? data[name] : null;

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

    array.controls.splice(0, array.controls.length);
    if (numberOfEntries === 0) {
      return;
    }

    const fieldInstance = collection.fieldInstance;
    const isGroup = fieldInstance instanceof AbstractGroupType;
    const isCollection = !isGroup && fieldInstance instanceof AbstractCollectionType;
    const isFormField = !isCollection && fieldInstance instanceof AbstractType;

    for (let i = 0; i < numberOfEntries; i++) {
      if (isGroup) {
        const childModel = (fieldInstance as AbstractGroupType<any>).options.model;
        const childFormGroup = ModelHandler.build(childModel, this);
        childFormGroup.setParent(array);

        if (fieldInstance.disabled) {
          childFormGroup.disable();
        }

        this.initializeCollectionFields(childFormGroup, childModel, data[i]);
        array.controls.push(childFormGroup);
      } else if (isCollection) {
        const childArray = new FormArray([], fieldInstance.controlOptions);
        childArray.setParent(array);

        if (fieldInstance.disabled) {
          childArray.disable();
        }

        this.initializeCollectionField(fieldInstance as AbstractCollectionType<any, any>, childArray, data[i]);
        array.controls.push(childArray);
      } else if (isFormField) {
        array.controls.push(new FormControl({value: null, disabled: fieldInstance.disabled}, fieldInstance.controlOptions));
      }
    }
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
        if (tmpErrors) {
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
