import {FormArray, FormControl, FormGroup} from './abstraction';

export type Constructor = ConstructorOf<any>;
export type ConstructorOf<TOf> = new (...args: any[]) => TOf;
export type ConstructorOf1<T1, TOf> = new (t1: T1) => TOf;
export type AbstractFormControl = FormControl | FormArray | FormGroup;
