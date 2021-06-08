import {AbstractGroupType, IGroupTypeOptions} from './abstract-group-type';

export abstract class AbstractLayoutType<T extends IGroupTypeOptions<TModel>, TModel = any> extends AbstractGroupType<T, TModel> {
}
