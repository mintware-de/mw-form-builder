import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ContentChildren,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges
} from '@angular/core';
import {FormSlotComponent} from '../form-slot/form-slot.component';
import {FormFieldComponent} from '../form-field/form-field.component';
import {AbstractFormFieldComponent} from '../abstract-form-field/abstract-form-field.component';
import {FormArray, FormControl, FormGroup} from '../abstraction';
import {FormModel} from '../form-builder/form-builder.component';
import {KeyValue} from '@angular/common';

@Component({
  selector: 'mw-form-group',
  template: `
    <ng-content></ng-content>
    <ng-container *ngFor="let field of model | keyvalue:orderAsGiven">
      <mw-form-field *ngIf="renderTargets[field.key] == null"
                     [formGroup]="element"
                     [element]="element.get(field.key)"
                     [fieldType]="field.value"
                     [path]="pathForField(field.key)"
                     [index]="indexFromParent"
                     [slots]="slots">
      </mw-form-field>
    </ng-container>
  `,
})
export class FormGroupComponent
  extends AbstractFormFieldComponent<any>
  implements OnChanges, AfterViewInit {

  @Input()
  public element: FormGroup;

  @Input()
  public isRootGroup: boolean = false;

  @Input()
  public model: FormModel;

  @ContentChildren(FormSlotComponent, {descendants: true})
  public mySlots: QueryList<FormSlotComponent>;

  public renderTargets: { [key: string]: FormSlotComponent } = {};

  private initializeTimeoutHandle: number = null;

  public orderAsGiven = (a: KeyValue<string, any>, b: KeyValue<string, any>): number => +(a || b);

  public get groupPath(): string {
    return (this.path == null || this.path.trim() === '')
      ? ''
      : this.path;
  }

  public get indexFromParent(): number {
    if (this.index == null) {
      return null;
    }

    let p: any = this.element;
    do {
      p = p.parent;
      if (p instanceof FormArray) {
        return this.index;
      }
    } while (p && p.parent && !(parent instanceof FormControl));

    return null;
  }

  constructor(private readonly cfr: ComponentFactoryResolver,
              private readonly cdr: ChangeDetectorRef,
  ) {
    super();
  }

  public ngAfterViewInit(): void {
    if (this.mySlots) {
      this.renderElementsInSlots();
      this.cdr.detectChanges();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    let wasRendered = false;
    if ('slots' in changes && changes.slots.currentValue) {
      this.renderElementsInSlots();
      wasRendered = true;
    }
    if (!wasRendered && 'mySlots' in changes && changes.mySlots.currentValue) {
      this.renderElementsInSlots();
    }
  }

  private renderElementsInSlots(): void {
    if (this.slots || this.mySlots) {
      this.createRenderTargets();

      Object.keys(this.renderTargets).map((name) => {
        if (!(name in this.renderTargets)) {
          return;
        }
        this.renderTargets[name].viewRef.clear();

        const factory = this.cfr.resolveComponentFactory(FormFieldComponent);
        const target = this.renderTargets[name].viewRef.createComponent(factory);

        target.instance.formGroup = this.formGroup;
        target.instance.element = this.formGroup.get(name);
        target.instance.slots = this.slots;
        target.instance.path = this.pathForField(name);
        target.instance.fieldType = this.model[name];
        target.instance.index = this.indexFromParent;

        target.instance.render();
      });

      if (this.isRootGroup) {
        if (this.initializeTimeoutHandle) {
          window.clearTimeout(this.initializeTimeoutHandle);
        }
        this.initializeTimeoutHandle = window.setTimeout(() => {
          this.element.initHandler.setIsInitialized(true);
          this.cdr.detectChanges();
        }, 5);
      }
    }
  }

  private createRenderTargets(): void {
    const groupPath = this.groupPath;
    if (this.slots) {
      this.slots.toArray().forEach((slot) => {
        if (slot.fieldName.substr(0, groupPath.length) !== groupPath) {
          return;
        }
        let name = slot.fieldName.substr(groupPath.length, slot.fieldName.length - groupPath.length);
        if (name.startsWith('.')) {
          name = name.substr(1);
        }
        if (name.indexOf('.') < 0 && name !== '') {
          this.renderTargets[name] = slot;
        }
      });
    }

    if (this.mySlots) {
      this.mySlots.toArray().forEach((slot) => {
        this.renderTargets[slot.fieldName] = slot;
      });
    }
  }

  public pathForField(fieldName: string): string {
    return (this.groupPath === '')
      ? fieldName
      : this.path + '.' + fieldName;
  }
}
