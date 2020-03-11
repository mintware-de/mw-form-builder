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
  public mwElement: FormGroup;

  @Input()
  public mwIsRootGroup: boolean = false;

  @ContentChildren(FormSlotComponent, {descendants: true})
  public mySlots: QueryList<FormSlotComponent>;

  public renderTargets: { [key: string]: FormSlotComponent } = {};

  constructor(protected readonly cfr: ComponentFactoryResolver,
              protected readonly cdr: ChangeDetectorRef,
  ) {
    super();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const mwPath = 'mwPath' in changes ? changes.mwPath.currentValue : this.mwPath;
    if ('mwPath' in changes) {
      this.groupPath = (mwPath == null || mwPath.trim() === '')
        ? ''
        : mwPath;
    }

    const mwFieldType = 'mwFieldType' in changes ? changes.mwFieldType.currentValue : this.mwFieldType;
    if ('mwPath' in changes || 'mwFieldType' in changes) {
      this.fieldPaths = Object.keys(mwFieldType.options.model).reduce((all, fieldName) => {
        if (mwFieldType.options.model[fieldName] instanceof AbstractLayoutType) {
          all[fieldName] = mwPath;
        } else {
          all[fieldName] = (this.groupPath !== '' ? this.groupPath + '.' : '') + fieldName;
        }
        return all;
      }, {});
    }

    if ('mwIndex' in changes) {
      const mwIndex = changes.mwIndex.currentValue;

      this.indexFromParent = null;
      if (mwIndex != null) {
        let p: any = this.mwElement;
        do {
          p = p.parent;
          if (p instanceof FormArray) {
            this.indexFromParent = this.mwIndex;
            break;
          }
        } while (p && p.parent && !(parent instanceof FormControl));
      }
    }

    this.elements = Object.keys(mwFieldType.options.model).reduce((all, fieldName) => {
      if (mwFieldType.options.model[fieldName] instanceof AbstractLayoutType) {
        all[fieldName] = this.mwElement;
      } else {
        all[fieldName] = this.mwElement.get(fieldName);
      }
      return all;
    }, {});

    let wasRendered = false;
    if ('mwSlots' in changes && changes.mwSlots.currentValue) {
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
    if (this.mwSlots || this.mySlots) {
      this.createRenderTargets();

      Object.keys(this.renderTargets).map((name) => {
        if (!(name in this.renderTargets)) {
          return;
        }
        this.renderTargets[name].viewRef.clear();

        const factory = this.cfr.resolveComponentFactory(FormFieldComponent);
        const target = this.renderTargets[name].viewRef.createComponent(factory);

        target.instance.mwFormGroup = this.mwFormGroup;
        target.instance.mwElement = this.elements[name];
        target.instance.mwSlots = this.mwSlots;
        target.instance.mwPath = this.fieldPaths[name];
        target.instance.mwFieldType = this.mwFieldType.options.model[name];
        target.instance.mwIndex = this.indexFromParent;

        target.instance.render();
      });

      this.mwElement.initHandler.setIsInitialized(true);
      this.cdr.detectChanges();
    }
  }

  private createRenderTargets(): void {
    const groupPath = this.groupPath;
    if (this.mwSlots) {
      this.mwSlots.toArray().forEach((slot) => {
        if (slot.mwFieldName.substr(0, groupPath.length) !== groupPath) {
          return;
        }
        let name = slot.mwFieldName.substr(groupPath.length, slot.mwFieldName.length - groupPath.length);
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
        this.renderTargets[slot.mwFieldName] = slot;
      });
    }
  }

  // noinspection JSUnusedGlobalSymbols
  public orderAsGiven(a: KeyValue<string, any>, b: KeyValue<string, any>): number {
    return a || b ? 1 : 0;
  }
}
