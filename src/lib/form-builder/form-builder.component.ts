import {
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
} from '@angular/core';
import {FormArray, FormControl, FormGroup, ValidationErrors} from '@angular/forms';
import {AbstractType} from '../form-type/abstract-type';
import {FormSlotComponent} from '../form-slot/form-slot.component';
import {ModelHandler} from '../model-handler';

export interface FormModel {
  [key: string]: AbstractType<any>;
}

@Component({
  selector: 'mw-form-builder',
  template: `
    <ng-content></ng-content>
    <form [formGroup]="group" (ngSubmit)="submit()" #form>
      <mw-form-group #fromGroup [element]="group" [formGroup]="group" [model]="formModel" [slots]="slots" [isFirst]="true">
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

  constructor(private readonly cdr: ChangeDetectorRef,
  ) {
  }

  public ngOnInit(): void {
    this.buildForm();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('formModel') && changes.formModel.currentValue != null) {
      this.rebuildForm();
    }
    if (changes.hasOwnProperty('formData') && changes.formData.currentValue != null) {
      if (!changes.hasOwnProperty('formModel')) {
        // this.buildArrayEntries(this.group.controls, this.formData);
      }
      if (this.group != null) {
        this.group.patchValue(this.formData);
      }
    }

    this.cdr.detectChanges();
  }

  public rebuildForm(): void {
    let res = {};
    if (this.group != null) {
      res = Object.assign({}, this.group.value);
    }

    this.buildForm();

    if (this.group != null) {
      this.group.patchValue(res);
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

  /**
   * Adds a new element to a array field
   * @param fieldName The name of the field
   * @param state The state of the field. (The field value)
   */
  public addArrayEntry(fieldName: string, state?: any): void {
    (this.group.get(fieldName) as FormArray).push(new FormControl(state, this.formModel[fieldName].validators));
  }

  /**
   * Removes an entry from a array field
   * @param fieldName The name of the field
   * @param index The index of the element to remove
   */
  public removeArrayEntry(fieldName: string, index: number): void {
    (this.group.get(fieldName) as FormArray).removeAt(index);
  }

  public get errors(): { [key: string]: ValidationErrors } {
    const errors = {};

    Object.keys(this.group.controls).forEach((controlName) => {
      if (this.group.controls[controlName].errors == null) {
        return;
      }
      errors[controlName] = this.group.controls[controlName].errors;
    });

    return Object.keys(errors).length === 0 ? null : errors;
  }
}
