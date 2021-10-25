import {Component} from '@angular/core';
import {AbstractFormGroupComponent} from '../abstract-form-group/abstract-form-group.component';
import {AbstractGroupType, IGroupTypeOptions} from '../form-type/abstract-group-type';
import {Constructor} from '../types';

export class FormGroupType<T = any> extends AbstractGroupType<IGroupTypeOptions<T>, T> {
  public readonly component: Constructor = FormGroupComponent;
}

@Component({
  selector: 'mw-form-group',
  template: `
    <ng-content></ng-content>
    <ng-container *ngFor="let field of mwFieldType.options.model | keyvalue:orderAsGiven"
                  mwFormField
                  [mwFormGroup]="mwElement"
                  [mwElement]="elements[field.key]"
                  [mwFieldType]="field.value"
                  [mwPath]="fieldPaths[field.key]"
                  [mwIndex]="indexFromParent">
    </ng-container>
  `,
})
export class FormGroupComponent extends AbstractFormGroupComponent<AbstractGroupType<IGroupTypeOptions>> {
}
