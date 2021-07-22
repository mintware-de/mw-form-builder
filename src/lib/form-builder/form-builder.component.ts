import {Component, ContentChildren, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges} from '@angular/core';
import {ValidationErrors} from '@angular/forms';
import {FormSlotDirective} from '../form-slot/form-slot.directive';
import {ModelHandler} from '../model-handler';
import {AbstractGroupType, IGroupTypeOptions} from '../form-type/abstract-group-type';
import {AbstractCollectionType} from '../form-type/abstract-collection-type';
import {FormArray, FormControl, FormGroup, IFormBuilder} from '../abstraction';
import {AbstractFormControl} from '../types';
import {FormGroupComponent, FormGroupType} from '../form-group/form-group.component';
import {AbstractLayoutType} from '../form-type/abstract-layout-type';
import {FormModel} from '../form-type/abstract-type';

@Component({
  selector: 'mw-form-builder',
  template: `
    <ng-content></ng-content>
    <form [formGroup]="group" (ngSubmit)="submit()">
      <mw-form-group [mwElement]="group"
                     [mwFormGroup]="group"
                     [mwFieldType]="fieldType"
                     [mwSlots]="mwSlots">
      </mw-form-group>
    </form>
  `,
  styles: []
})
export class FormBuilderComponent<T extends { [key: string]: any } = {}> implements OnInit, OnChanges, IFormBuilder {

  public fieldType: AbstractGroupType<IGroupTypeOptions<T>, T>;

  @Input()
  public mwFormModel: FormModel<T>;

  @Input()
  public mwFormData: T;

  @Output()
  public mwFormSubmit: EventEmitter<T> = new EventEmitter<T>();

  @ContentChildren(FormSlotDirective, {descendants: true})
  public mwSlots: QueryList<FormSlotDirective>;

  public group: FormGroup;

  public get valid(): boolean {
    return this.group?.valid ?? true;
  }

  public get invalid(): boolean {
    return this.group?.invalid ?? false;
  }

  public ngOnInit(): void {
    if (this.group == null) {
      this.rebuildForm();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ('mwFormModel' in changes && changes.mwFormModel.currentValue) {
      this.rebuildForm();
      this.fieldType = new FormGroupType<T>({
        model: this.mwFormModel,
      });

      Object.assign(this.fieldType, {
        builderInstance: this,
        component: FormGroupComponent,
        control: this.group,
      });
    }
    if ('mwFormData' in changes && changes.mwFormData.currentValue) {
      if (!('mwFormModel' in changes)) {
        this.initializeCollectionFields(this.group, this.mwFormModel, this.mwFormData);
        this.group.initHandler.setIsInitialized(false);
        this.group.initHandler.setIsInitialized(true);
      }
      if (this.group) {
        this.group.patchValue(this.mwFormData);
      }
    }
  }

  public rebuildForm(): void {
    let res = null;
    let groupIsInitialized = false;
    if (this.group) {
      res = Object.assign({}, this.group.value);
      groupIsInitialized = this.group.initHandler.isInitialized;
    } else if (this.mwFormData) {
      res = Object.assign({}, this.mwFormData);
    }

    this.group = ModelHandler.build(this.mwFormModel, this);
    this.initializeCollectionFields(this.group, this.mwFormModel, res);

    if (this.group && res) {
      if (groupIsInitialized) {
        this.group.initHandler.setIsInitialized(true);
      }
      this.group.patchValue(res);
    }
  }

  private initializeCollectionFields(group: FormGroup, model: FormModel, data: any): void {
    Object.keys(model).forEach((name) => {
      const formType = model[name];
      const childData = (data && name in data) ? data[name] : null;

      const control = group.get(name);
      if (formType instanceof AbstractGroupType && control instanceof FormGroup) {
        this.initializeCollectionFields(control, formType.options.model, childData);
      } else if (formType instanceof AbstractLayoutType) {
        this.initializeCollectionFields(group, formType.options.model, data);
      } else if (formType instanceof AbstractCollectionType && control instanceof FormArray) {
        this.initializeCollectionField(formType, control, childData);
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

    for (let i = 0; i < numberOfEntries; i++) {
      const control: AbstractFormControl = ModelHandler.buildSingleField(fieldInstance, this);
      if (!control) {
        continue;
      }
      if (fieldInstance instanceof AbstractGroupType && control instanceof FormGroup) {
        control.setParent(array);

        if (fieldInstance.disabled) {
          control.disable();
        }

        this.initializeCollectionFields(control, fieldInstance.options.model, data[i]);
      } else if (fieldInstance instanceof AbstractCollectionType && control instanceof FormArray) {
        control.setParent(array);

        if (fieldInstance.disabled) {
          control.disable();
        }

        this.initializeCollectionField(fieldInstance, control, data[i]);
      }
      array.controls.push(control);
    }
  }

  public submit(): T {
    this.validateAllFormFields(this.group);

    if (!this.group.valid) {
      return;
    }

    this.mwFormSubmit.emit(this.group.value);

    return this.group.value;
  }

  private validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
        control.updateValueAndValidity({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
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
        const tmpErrors = this.getErrors(control);
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
