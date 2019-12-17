import {AbstractType} from './abstract-type';

export interface ICollectionTypeOptions<T> {
  entrySettings: T;
}

export abstract class AbstractCollectionType<TConfig, T> extends AbstractType<T & ICollectionTypeOptions<TConfig>> {
  public readonly fieldInstance: AbstractType<TConfig>;

  constructor(public readonly childType: new(options: TConfig) => AbstractType<TConfig>,
              options: T & ICollectionTypeOptions<TConfig>) {
    super(options);
    this.fieldInstance = new this.childType(this.options.entrySettings);
  }
}
