import {AbstractLayoutType} from '../form-type/abstract-layout-type';
import {AbstractFormGroupComponent} from '../abstract-form-group/abstract-form-group.component';

// noinspection JSUnusedGlobalSymbols
export abstract class AbstractLayoutComponent<FormType extends AbstractLayoutType<any>>
  extends AbstractFormGroupComponent<FormType> {
}
