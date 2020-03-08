import {AbstractFormFieldComponent} from '../abstract-form-field/abstract-form-field.component';
import {AbstractGroupType, IGroupTypeOptions} from '../form-type/abstract-group-type';
import {KeyValue} from '@angular/common';
import {AbstractLayoutType} from '../form-type/abstract-layout-type';
import {
  AfterContentInit,
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ContentChildren, Injectable,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges
} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '../abstraction';
import {AbstractFormControl} from '../types';
import {FormSlotComponent} from '../form-slot/form-slot.component';
import {FormFieldComponent} from '../form-field/form-field.component';

// noinspection JSUnusedGlobalSymbols
@Injectable()
export abstract class AbstractFormGroupComponent<FormType extends AbstractGroupType<IGroupTypeOptions>>
  extends AbstractFormFieldComponent<FormType> implements OnChanges, AfterContentInit {

  public groupPath: string = '';
  public indexFromParent?: number = null;

  public fieldPaths: { [key: string]: string } = {};
  public elements: { [key: string]: AbstractFormControl } = {};

  @Input()
  public element: FormGroup;

  @Input()
  public isRootGroup: boolean = false;

  @ContentChildren(FormSlotComponent, {descendants: true})
  public mySlots: QueryList<FormSlotComponent>;

  public renderTargets: { [key: string]: FormSlotComponent } = {};

  private initializeTimeoutHandle: number = null;

  constructor(private readonly cfr: ComponentFactoryResolver,
              private readonly cdr: ChangeDetectorRef,
  ) {
    super();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const path = 'path' in changes ? changes.path.currentValue : this.path;
    if ('path' in changes) {
      this.groupPath = (path == null || path.trim() === '')
        ? ''
        : path;
    }

    const fieldType = 'fieldType' in changes ? changes.fieldType.currentValue : this.fieldType;
    if ('path' in changes || 'fieldType' in changes) {
      this.fieldPaths = Object.keys(fieldType.options.model).reduce((all, fieldName) => {
        if (fieldType.options.model[fieldName] instanceof AbstractLayoutType) {
          all[fieldName] = path;
        } else {
          all[fieldName] = (this.groupPath !== '' ? this.groupPath + '.' : '') + fieldName;
        }
        return all;
      }, {});
    }

    if ('index' in changes) {
      const index = changes.index.currentValue;

      this.indexFromParent = null;
      if (index != null) {
        let p: any = this.element;
        do {
          p = p.parent;
          if (p instanceof FormArray) {
            this.indexFromParent = this.index;
            break;
          }
        } while (p && p.parent && !(parent instanceof FormControl));
      }
    }

    this.elements = Object.keys(fieldType.options.model).reduce((all, fieldName) => {
      if (fieldType.options.model[fieldName] instanceof AbstractLayoutType) {
        all[fieldName] = this.element;
      } else {
        all[fieldName] = this.element.get(fieldName);
      }
      return all;
    }, {});

    let wasRendered = false;
    if ('slots' in changes && changes.slots.currentValue) {
      this.renderElementsInSlots();
      wasRendered = true;
    }
    if (!wasRendered && 'mySlots' in changes && changes.mySlots.currentValue) {
      this.renderElementsInSlots();
    }
  }

  public ngAfterContentInit(): void {
    if (this.mySlots) {
      this.renderElementsInSlots();
      this.cdr.detectChanges();
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
        target.instance.path = this.fieldPaths[name];
        target.instance.fieldType = this.fieldType.options.model[name];
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

  // noinspection JSUnusedGlobalSymbols
  public orderAsGiven(a: KeyValue<string, any>, b: KeyValue<string, any>): number {
    return a || b ? 1 : 0;
  }
}
