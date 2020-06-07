import {AbstractType, FormModel} from './abstract-type';
import {FormGroup} from '../abstraction';

export interface IGroupTypeOptions {
  model: FormModel;
}

export abstract class AbstractGroupType<T extends IGroupTypeOptions> extends AbstractType<T> {
  public control: FormGroup;
}
