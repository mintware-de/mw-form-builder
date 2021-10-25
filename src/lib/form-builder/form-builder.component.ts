import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors} from '@angular/forms';
import {ModelHandler} from '../model-handler';
import {AbstractGroupType, IGroupTypeOptions} from '../form-type/abstract-group-type';
import {AbstractCollectionType} from '../form-type/abstract-collection-type';
import {IFormBuilder} from '../types';
import {FormGroupComponent, FormGroupType} from '../form-group/form-group.component';
import {AbstractLayoutType} from '../form-type/abstract-layout-type';
import {FormModel} from '../form-type/abstract-type';
import {FormBuilderOptions} from '../form-builder.options';
import {ModelMerger} from '../model-merger';

@Component({
  selector: 'mw-form-builder',
  template: `
    <ng-content></ng-content>
    <form [formGroup]="group" (ngSubmit)="submit()">
      <mw-form-group [mwElement]="group"
                     [mwFormGroup]="group"
                     [mwFieldType]="fieldType">
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
  public mwPreSubmit: EventEmitter<IFormBuilder> = new EventEmitter<IFormBuilder>();

  @Output()
  public mwFormSubmit: EventEmitter<T> = new EventEmitter<T>();

  public group: FormGroup;

  private internalFormModel: FormModel<T>;

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
    if ('mwFormData' in changes && changes.mwFormData.currentValue) {
      this.group = null;
      if (!('mwFormModel' in changes)) {
        this.rebuildForm();
      }
      if (this.group) {
        this.group.patchValue(this.mwFormData);
      }
    }
    if ('mwFormModel' in changes && changes.mwFormModel.currentValue) {
      this.rebuildForm();
      this.fieldType = new FormGroupType<T>({
        model: this.internalFormModel,
      });

      Object.assign(this.fieldType, {
        builderInstance: this,
        component: FormGroupComponent,
        control: this.group,
      });
    }
  }

  public rebuildForm(): void {
    let res = null;
    if (this.group) {
      res = Object.assign({}, this.group.value);
    } else if (this.mwFormData) {
      res = Object.assign({}, this.mwFormData);
    }

    this.rebuildFormModel();
    this.group = ModelHandler.build(this.internalFormModel, this);
    this.initializeCollectionFields(this.group, this.internalFormModel, res);

    if (this.group && res) {
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
      const control: AbstractControl = ModelHandler.buildSingleField(fieldInstance, this);
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
    this.preSubmit();

    this.validateAllFormFields(this.group);

    if (!this.group.valid) {
      return;
    }

    this.mwFormSubmit.emit(this.group.value);

    return this.group.value;
  }

  private preSubmit(): void {
    let preSubmitHandler = this.mwPreSubmit.observers.length > 0 ? this.mwPreSubmit.emit.bind(this.mwPreSubmit) : null;
    if (preSubmitHandler == null) {
      preSubmitHandler = FormBuilderOptions.preFormSubmit;
    }
    if (preSubmitHandler != null) {
      preSubmitHandler(this);
    }
  }

  private validateAllFormFields(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
        control.updateValueAndValidity({onlySelf: true});
      } else if (control instanceof FormGroup || control instanceof FormArray) {
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

  private rebuildFormModel(): void {
    const merger = new ModelMerger(this.mwFormModel, this.mwFormData);
    this.internalFormModel = merger.merge();
    console.log(this.internalFormModel);
  }
}
