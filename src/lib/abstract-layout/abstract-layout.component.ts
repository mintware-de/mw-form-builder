import {AbstractLayoutType} from '../form-type/abstract-layout-type';
import {AbstractFormGroupComponent} from '../abstract-form-group/abstract-form-group.component';
import {Directive} from '@angular/core';

// noinspection JSUnusedGlobalSymbols
@Directive()
export abstract class AbstractLayoutComponent<FormType extends AbstractLayoutType<any>>
  extends AbstractFormGroupComponent<FormType> {
}
