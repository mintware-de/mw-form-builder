import {AfterViewInit, Directive, Input, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[mwFormSlot]',
  exportAs: 'mwFormSlot',
})
export class FormSlotDirective implements AfterViewInit {

  @Input()
  public mwFieldName: string;

  private renderFn: (viewRef: ViewContainerRef) => void;

  constructor(public viewRef: ViewContainerRef,
  ) {
  }

  public ngAfterViewInit(): void {
    if (this.renderFn) {
      this.renderFn(this.viewRef);
    }
  }

  public setup(renderFunction: (viewRef: ViewContainerRef) => void): void {
    this.renderFn = renderFunction;
    if (this.viewRef) {
      this.ngAfterViewInit();
    }
  }
}
