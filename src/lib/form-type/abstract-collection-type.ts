import {ConstructorOf1} from '../types';
import {FormArray} from '@angular/forms';
import {AbstractType} from './abstract-type';

export interface ICollectionTypeOptions<T> {
  entrySettings: T;
}

export abstract class AbstractCollectionType<TConfig, T> extends AbstractType<T & ICollectionTypeOptions<TConfig>> {
  public readonly fieldInstance: AbstractType<TConfig>;

  public control: FormArray;

  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor(public readonly childType: ConstructorOf1<TConfig, AbstractType<TConfig>>,
              options: T & ICollectionTypeOptions<TConfig>) {
    super(options);
    this.fieldInstance = new this.childType(this.options.entrySettings);
  }
}
