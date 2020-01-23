export class InitHandler<T> {
  private propIsInitialized: boolean = false;

  public get isInitialized(): boolean {
    return this.propIsInitialized;
  }

  public setIsInitialized(value: boolean): void {
    const isGroupOrArray = 'controls' in this.instance;

    const ripple = this.propIsInitialized !== value;
    this.propIsInitialized = value;
    if (isGroupOrArray) {
      (this.instance as any as { _setUpControls: () => void })._setUpControls();
    }
    (this.instance as any).updateValueAndValidity({onlySelf: false, emitEvent: true});

    if (ripple && isGroupOrArray) {
      const childControls = (this.instance as any as { controls: { [k: string]: any } }).controls;
      Object.keys(childControls)
            .forEach((k) => childControls[k].initHandler.setIsInitialized(value));
    }
  }

  constructor(private readonly instance: T,
  ) {
  }
}
