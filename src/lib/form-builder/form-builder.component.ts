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
import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import {AbstractType} from '../form-type/abstract-type';
import {FormFieldComponent} from '../form-field/form-field.component';
import {FormSlotComponent} from '../form-slot/form-slot.component';

@Component({
  selector: 'mw-form-builder',
  template: `
    <form [formGroup]="group" (ngSubmit)="submit()" #form>
      <ng-content></ng-content>
      <ng-container *ngFor="let field of (formModel | keyvalue:orderAsGiven)">
        <mw-form-field *ngIf="renderTargets[field.key] == null"
                       [formGroup]="group"
                       [fieldName]="field.key"
                       [renderedThroughBuilder]="true"
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

    console.log(this.renderTargets);

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
    console.log(changes);
    if (changes.hasOwnProperty('formModel') && changes.formModel.currentValue != null) {
      this.rebuildForm();
    }
    if (changes.hasOwnProperty('formData') && changes.formData.currentValue != null) {
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
      controls[name] = new FormControl(null, this.formModel[name].validators);
    });

    this.group = new FormGroup(controls);
  }

  public submit(): void {
    if (!this.group.valid) {
      return;
    }

    this.onSubmit.emit(this.group.value);
  }
}
