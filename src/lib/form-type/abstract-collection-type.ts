import {AbstractType} from './abstract-type';

export abstract class AbstractCollectionType<TConfig, T> extends AbstractType<T & { entrySettings: TConfig }> {
  public readonly fieldInstance: AbstractType<TConfig>;

  constructor(public readonly childType: new(options: TConfig) => AbstractType<TConfig>,
              options: T & { entrySettings: TConfig }) {
    super(options);
    this.fieldInstance = new this.childType(this.options.entrySettings);
  }
}
