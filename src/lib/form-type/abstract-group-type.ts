import {AbstractType} from './abstract-type';
import {FormModel} from '../form-builder/form-builder.component';
import {FormGroup} from '../abstraction';

export interface IGroupTypeOptions {
  model: FormModel;
}

export abstract class AbstractGroupType<T extends IGroupTypeOptions> extends AbstractType<T> {

  public control: FormGroup;

}
