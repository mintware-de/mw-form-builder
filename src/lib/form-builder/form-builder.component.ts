import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ContentChildren, EventEmitter,
  Input, OnChanges,
  OnInit,
  Output, SimpleChanges,
} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';
import {AbstractType} from '../form-type/abstract-type';
import {FormFieldComponent} from '../form-field/form-field.component';
import {FormSlotComponent} from '../form-slot/form-slot.component';
import {AbstractCollectionType} from '../form-type/abstract-collection-type';

@Component({
  selector: 'mw-form-builder',
  template: `
    <form [formGroup]="group" (ngSubmit)="submit()" #form>
      <ng-content></ng-content>
      <ng-container *ngFor="let field of (formModel | keyvalue:orderAsGiven)">
        <mw-form-field *ngIf="renderTargets[field.key] == null"
                       [formGroup]="group"
                       [fieldName]="field.key"
                       [fieldType]="field.value">
        </mw-form-field>
      </ng-container>
    </form>
  `,
  styles: []
})
export class FormBuilderComponent implements OnInit, OnChanges, AfterViewInit {

  @Input()
  public formModel: { [key: string]: AbstractType<any> };

  @Input()
  public formData: { [key: string]: any };

  @Output()
  public onSubmit: EventEmitter<any> = new EventEmitter<any>();

  @ContentChildren(FormSlotComponent, {descendants: true})
  public slots: any;

  public renderTargets: { [key: string]: FormSlotComponent } = {};

  public group: FormGroup;

  public orderAsGiven = (): number => 1;

  constructor(private readonly cdr: ChangeDetectorRef,
              private readonly cfr: ComponentFactoryResolver,
  ) {
  }

  public ngOnInit(): void {
    this.buildForm();
  }

  public ngAfterViewInit(): void {
    this.slots.toArray().forEach((slot) => {
      this.renderTargets[slot.fieldName] = slot;
    });

    Object.keys(this.renderTargets).map((name) => {
      const factory = this.cfr.resolveComponentFactory(FormFieldComponent);
      const target = this.renderTargets[name].viewRef.createComponent(factory);
      target.instance.formGroup = this.group;
      target.instance.fieldName = name;
      target.instance.fieldType = this.formModel[name];
    });

    this.group.patchValue(this.formData);

    this.cdr.detectChanges();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('formModel') && changes.formModel.currentValue != null) {
      this.rebuildForm();
    }
    if (changes.hasOwnProperty('formData') && changes.formData.currentValue != null) {
      if (!changes.hasOwnProperty('formModel')) {
        this.buildArrayEntries(this.group.controls, this.formData);
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
  public buildForm(): void {
    const controls: { [key: string]: AbstractControl } = {};

    Object.keys(this.formModel).forEach((name) => {
      let control: FormControl | FormArray = new FormControl(null, this.formModel[name].validators);
      if (this.formModel[name] instanceof AbstractCollectionType) {
        control = new FormArray([]);
      }
      controls[name] = control;
    });

    this.buildArrayEntries(controls, this.formData);

    this.group = new FormGroup(controls);
  }

  public submit(): void {
    if (!this.group.valid) {
      return;
    }

    this.onSubmit.emit(this.group.value);
  }

  private buildArrayEntries(controls: { [p: string]: AbstractControl }, data: any): void {
    Object.keys(controls).forEach((name) => {
      if (controls[name] instanceof FormArray) {
        if ((controls[name] as any).clear != null) {
          (controls[name] as FormArray).clear();
        }

        if (Array.isArray(data[name])) {
          data[name].forEach((state) => {
            (controls[name] as FormArray).push(new FormControl(state, this.formModel[name].validators));
          });
        }
      }
    });
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
}
