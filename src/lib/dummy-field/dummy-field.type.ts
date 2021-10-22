import {AbstractType} from '../form-type/abstract-type';
import {Constructor} from '../types';
import {DummyFieldComponent} from './dummy-field.component';

export class DummyField extends AbstractType<any> {
  public readonly component: Constructor = DummyFieldComponent;

  constructor() {
    super({});
  }
}
