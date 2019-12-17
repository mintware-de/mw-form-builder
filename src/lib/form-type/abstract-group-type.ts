import {AbstractType} from './abstract-type';
import {FormModel} from '../form-builder/form-builder.component';

export abstract class AbstractGroupType<T extends { model: FormModel }> extends AbstractType<T> {
}
