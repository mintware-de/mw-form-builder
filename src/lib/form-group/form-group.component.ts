import {Component} from '@angular/core';
import {AbstractFormGroupComponent} from '../abstract-form-group/abstract-form-group.component';
import {AbstractGroupType, IGroupTypeOptions} from '../form-type/abstract-group-type';
import {Constructor} from '../types';

export class FormGroupType extends AbstractGroupType<IGroupTypeOptions> {
  public readonly component: Constructor = FormGroupComponent;
}

@Component({
  selector: 'mw-form-group',
  template: `
    <ng-content></ng-content>
    <ng-container *ngFor="let field of fieldType.options.model | keyvalue:orderAsGiven">
      <mw-form-field *ngIf="renderTargets[field.key] == null"
                     [formGroup]="element"
                     [element]="elements[field.key]"
                     [fieldType]="field.value"
                     [path]="fieldPaths[field.key]"
                     [index]="indexFromParent"
                     [slots]="slots">
      </mw-form-field>
    </ng-container>
  `,
})
export class FormGroupComponent extends AbstractFormGroupComponent<AbstractGroupType<IGroupTypeOptions>> {
}
