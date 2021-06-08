import {AbstractType, FormModel} from './abstract-type';
import {FormGroup} from '../abstraction';

export interface IGroupTypeOptions<T = any> {
  model: FormModel<T>;
}

export abstract class AbstractGroupType<T extends IGroupTypeOptions<TModel>, TModel = any> extends AbstractType<T> {
  public control: FormGroup;
}
