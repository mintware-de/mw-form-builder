## Creating simple form fields
As described previously, every form field has three parts.
We start with the configuration object. This object contains properties for configuring the field.
Let's say we've a label property, a required property and min and maxLength properties.

```typescript
export interface ITextFormTypeConfiguration {
  /** The label of this field */
  label: string;

  /** Is this field is required? */
  required?: boolean;

  /** The min length of the input */
  minLength?: number;

  /** The max length of the input */
  maxLength?: number;
}
```

Next, we create the `AbstractType<T>` for this field. The type is used in the form model.
It holds the type of the component and set up the validators. It also handles the disabled state.

```typescript
import {ValidatorFn, Validators} from '@angular/forms';
import {AbstractType} from 'mw-form-builder';

export class TextFormType extends AbstractType<ITextFormTypeConfiguration> {

  // This component is created in the next step!
  readonly component: Constructor = TextFormFieldComponent;

  constructor(public options: ITextFormTypeConfiguration) {
    // Set the configuration defaults
    super(Object.assign({
      required: true,
    } as ITextFormTypeConfiguration, options));
  }

  public get validators(): ValidatorFn[] {
    const validators = [];
    if (this.options != null) {
      if (this.options.required === true) {
        validators.push(Validators.required);
      }
      if (this.options.minLength > 0) {
        validators.push(Validators.minLength(this.options.minLength));
      }
      if (this.options.maxLength > 0) {
        validators.push(Validators.maxLength(this.options.maxLength));
      }
    }

    return validators;
  }
}
```

The last step is creating a Angular component for Rendering the fields.
The component should extend the `AbstractFormFieldComponent<AbstractType>` component.
```typescript
@Component({
  selector: 'app-text-form-field',
  template: `
    <ng-container>
      <label [for]="mwPath" *ngIf="mwFieldType.options.label != ''">{{mwFieldType.options.label}}: </label>
      <input [formControl]="mwElement" [id]="mwPath">

      <div *ngIf="mwElement.invalid && (mwElement.dirty || mwElement.touched)"
           class="alert alert-danger">
        <div *ngIf="mwElement.errors.required">
          {{mwFieldType.options.label}} is required.
        </div>
        <div *ngIf="mwElement.errors.minlength && mwFieldType.options.minLength != mwFieldType.options.maxLength">
          {{mwFieldType.options.label}} must be at least {{mwFieldType.options.minLength}} characters long.
        </div>
        <div *ngIf="mwElement.errors.maxlength && mwFieldType.options.minLength != mwFieldType.options.maxLength">
          {{mwFieldType.options.label}} must be max {{mwFieldType.options.maxLength}} characters long.
        </div>
        <div *ngIf="(mwElement.errors.minlength || mwElement.errors.maxlength) && mwFieldType.options.minLength == mwFieldType.options.maxLength">
          {{mwFieldType.options.label}} must be exact {{mwFieldType.options.minLength}} characters long.
        </div>
      </div>
    </ng-container>
  `
})
export class TextFormFieldComponent extends AbstractFormFieldComponent<TextFormType> {
}
```
