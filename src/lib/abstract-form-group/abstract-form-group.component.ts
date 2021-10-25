import {AbstractFormFieldComponent} from '../abstract-form-field/abstract-form-field.component';
import {AbstractGroupType, IGroupTypeOptions} from '../form-type/abstract-group-type';
import {AbstractLayoutType} from '../form-type/abstract-layout-type';
import {ChangeDetectorRef, ComponentFactoryResolver, Directive, Injectable, Input, OnChanges, SimpleChanges} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';

// noinspection JSUnusedGlobalSymbols
@Directive()
@Injectable()
export abstract class AbstractFormGroupComponent<FormType extends AbstractGroupType<IGroupTypeOptions>>
  extends AbstractFormFieldComponent<FormType> implements OnChanges {

  public groupPath: string = '';
  public indexFromParent?: number = null;

  public fieldPaths: { [key: string]: string } = {};
  public elements: { [key: string]: AbstractControl } = {};

  @Input()
  public mwElement: FormGroup;

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
    }, {} as { [key: string]: AbstractControl });
  }
  // noinspection JSUnusedGlobalSymbols
  public orderAsGiven = (_: any, __: any): number => 0;
}
