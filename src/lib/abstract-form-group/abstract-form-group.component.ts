import {AbstractFormFieldComponent} from '../abstract-form-field/abstract-form-field.component';
import {AbstractGroupType, IGroupTypeOptions} from '../form-type/abstract-group-type';
import {KeyValue} from '@angular/common';
import {AbstractLayoutType} from '../form-type/abstract-layout-type';
import {ChangeDetectorRef, ComponentFactoryResolver, Directive, Injectable, Input, QueryList, ViewChildren} from '@angular/core';
import {OnChanges, SimpleChanges} from '@angular/core';
import {AfterContentInit} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '../abstraction';
import {AbstractFormControl} from '../types';
import {FormSlotDirective} from '../form-slot/form-slot.directive';
import {FieldInstanceHelper} from '../field-instance-helper';

// noinspection JSUnusedGlobalSymbols
@Directive()
@Injectable()
export abstract class AbstractFormGroupComponent<FormType extends AbstractGroupType<IGroupTypeOptions>>
  extends AbstractFormFieldComponent<FormType> implements OnChanges, AfterContentInit {

  public groupPath: string = '';
  public indexFromParent?: number = null;

  public fieldPaths: { [key: string]: string } = {};
  public elements: { [key: string]: AbstractFormControl } = {};

  @Input()
  public mwElement: FormGroup;

  @ViewChildren(FormSlotDirective)
  public mySlots: QueryList<FormSlotDirective>;

  public renderTargets: { [key: string]: FormSlotDirective } = {};

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
    if (!(this.mwSlots || this.mySlots)) {
      return;
    }
    this.createRenderTargets();

    Object.keys(this.renderTargets).forEach((name) => {
      if (!(name in this.renderTargets)) {
        return;
      }

      this.renderTargets[name].setup((viewRef, elRef) => {
        viewRef.clear();

        const factory = this.cfr.resolveComponentFactory<AbstractFormFieldComponent<any>>(this.mwFieldType.options.model[name].component);

        const component = viewRef.createComponent(factory);

        const isGroup = this.mwFieldType.options.model[name] instanceof AbstractGroupType;
        FieldInstanceHelper.setupFieldInstance(component.instance, {
          mwFormGroup: isGroup ? this.elements[name] : this.mwFormGroup,
          mwElement: this.elements[name],
          mwFieldType: this.mwFieldType.options.model[name],
          mwSlots: this.mwSlots,
          mwPath: this.fieldPaths[name],
          mwIndex: this.indexFromParent,
        });

        const host = elRef.nativeElement;
        if (host instanceof HTMLElement && !host.contains(component.location.nativeElement)) {
          host.appendChild(component.location.nativeElement);
        }

        component.changeDetectorRef.detectChanges();
      });
    });

    this.mwElement.initHandler.setIsInitialized(true);
    this.cdr.detectChanges();
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
