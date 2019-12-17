import {ChangeDetectorRef, Component, ComponentFactoryResolver, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FormModel} from '../form-builder/form-builder.component';
import {FormSlotComponent} from '../form-slot/form-slot.component';
import {FormFieldComponent} from '../form-field/form-field.component';
import {AbstractFormFieldComponent} from '../abstract-form-field/abstract-form-field.component';

@Component({
  selector: 'mw-form-group',
  template: `
    <ng-content></ng-content>
    <ng-container *ngIf="slots != null">
      <ng-container [formGroup]="formGroup">
        <ng-container *ngFor="let field of (model | keyvalue:orderAsGiven)">
          <mw-form-field *ngIf="renderTargets[field.key] == null"
                         [formGroup]="element"
                         [element]="element.get(field.key)"
                         [fieldType]="field.value"
                         [path]="pathForField(field.key)"
                         [slots]="slots">
          </mw-form-field>
        </ng-container>
      </ng-container>
    </ng-container>
  `,
})
export class FormGroupComponent extends AbstractFormFieldComponent<any> implements OnChanges {
  @Input()
  public model: FormModel;

  @Input()
  public isFirst: boolean = false;

  public get groupPath(): string {
    return (this.path == null || this.path.trim() === '')
      ? ''
      : this.path;
  }


  public renderTargets: { [key: string]: FormSlotComponent } = {};

  public orderAsGiven = (): number => 1;

  constructor(private readonly cdr: ChangeDetectorRef,
              private readonly cfr: ComponentFactoryResolver,
  ) {
    super();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('slots') && changes.slots.previousValue == null && changes.slots.currentValue != null) {
      this.renderElementsInSlots();
    }
  }

  private renderElementsInSlots(): void {
    if (this.slots != null) {
      const groupPath = this.groupPath;
      this.slots.toArray().forEach((slot) => {
        if (slot.fieldName.substr(0, groupPath.length) !== groupPath) {
          return;
        }
        const name = slot.fieldName.substr(groupPath.length + 1, slot.fieldName.length - groupPath.length);
        if (name.indexOf('.') > 0) {
          return;
        }
        this.renderTargets[name] = slot;
      });

      Object.keys(this.renderTargets).map((name) => {
        if (!this.renderTargets.hasOwnProperty(name)) {
          return;
        }
        const factory = this.cfr.resolveComponentFactory(FormFieldComponent);
        const target = this.renderTargets[name].viewRef.createComponent(factory);
        target.instance.formGroup = this.formGroup;
        target.instance.element = this.formGroup.get(name);
        target.instance.fieldType = this.model[name];
      });
      this.cdr.detectChanges();
    }
  }

  public pathForField(fieldName: string): string {
    return (this.groupPath === '')
      ? fieldName
      : this.path + '.' + fieldName;
  }
}
