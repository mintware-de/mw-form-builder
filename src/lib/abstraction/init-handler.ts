import {AbstractFormControl} from '../types';

export class InitHandler<T extends AbstractFormControl> {
  private propIsInitialized: boolean = false;

  public get isInitialized(): boolean {
    return this.propIsInitialized;
  }

  public setIsInitialized(value: boolean): void {
    const isGroupOrArray = 'controls' in this.instance;

    this.propIsInitialized = value;
    if (isGroupOrArray) {
      (this.instance as any as { _setUpControls: () => void })._setUpControls();
    }
    this.instance.updateValueAndValidity({onlySelf: false, emitEvent: true});

    if (isGroupOrArray) {
      const childControls = (this.instance as { controls: { [k: string]: any } }).controls;
      Object.keys(childControls)
            .forEach((k) => childControls[k].initHandler.setIsInitialized(value));
    }
  }

  constructor(protected readonly instance: T,
  ) {
  }
}
