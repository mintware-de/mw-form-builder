# mw-form-builder

Reusable code driven forms for angular.
Beware: This package is alpha and w.i.p.

## Install

`npm i -d mw-form-builder`

## Usage

Import the `FormBuilderModule` and the `ReactiveFormsModule` in your Angular Module

```typescript
@NgModule({
  imports: [
    FormBuilderModule,
    ReactiveFormsModule
  ],
})
export class AppModule {
}
```

Write a component for each input type. For example for a simple text field:
```typescript

// Options how the field can be configured
interface ITextFormTypeConfiguration {
  label: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}

// The form type which needs a component and validators
export class TextFormType extends AbstractType<ITextFormTypeConfiguration> {
  readonly component: Type<any> = TextFormFieldComponent;

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

// The component which represents the field itself
// The 3 input fields are filled automatically
@Component({
  selector: 'app-text-form-field',
  template: `
    <ng-container [formGroup]="formGroup">
      <label [for]="fieldName">{{fieldType.options.label}}: </label>
      <input [formControlName]="fieldName" [id]="fieldName">
      <div *ngIf="el.invalid && (el.dirty || el.touched)"
           class="alert alert-danger">
        <div *ngIf="el.errors.required">
          {{fieldType.options.label}} is required.
        </div>
        <div *ngIf="el.errors.minlength && fieldType.options.minLength != fieldType.options.maxLength">
          {{fieldType.options.label}} must be at least {{fieldType.options.minLength}} characters long.
        </div>
        <div *ngIf="el.errors.maxlength && fieldType.options.minLength != fieldType.options.maxLength">
          {{fieldType.options.label}} must be max {{fieldType.options.maxLength}} characters long.
        </div>
        <div *ngIf="(el.errors.minlength || el.errors.maxlength) && fieldType.options.minLength == fieldType.options.maxLength">
          {{fieldType.options.label}} must be exact {{fieldType.options.minLength}} characters long.
        </div>
      </div>
    </ng-container>
  `
})
export class TextFormFieldComponent {

  @Input()
  public formGroup: FormGroup; // Holds the form group

  @Input()
  public fieldName: string; // Holds the name of this field

  @Input()
  public fieldType: TextFormType; // Holds options

  public get el(): AbstractControl {
    return this.formGroup.get(this.fieldName);
  }
}
```

Create a form model:

```typescript
export class AppComponent {
  public formModel: { [key: string]: any } = {
    firstName: new TextFormType({ // options, see above
      label: 'First name',
      required: true,
      minLength: 3,
    }),
    surname: new TextFormType({ // options, see above
      label: 'Surname',
      required: true,
      minLength: 3,
    })
  };

  // Initial form data
  public data: any = {firstName: 'John', surname: 'Doe'};

  public submit($event: any) {
    console.log($event); // form data
  }
}
```

Use it in the template:

```html
<mw-form-builder #myForm
                 [formData]="data"
                 [formModel]="formModel"
                 (onSubmit)="submit($event)">
</mw-form-builder>
<button (click)="myForm.submit()">submit</button>
<!-- Submit will also check the validity -->
```

You can also render the fields where you want:


```html
<mw-form-builder #myForm
                 [formData]="data"
                 [formModel]="formModel"
                 (onSubmit)="submit($event)">

    <div style="background-color: red">
        Field 1
        <mw-form-slot fieldName="firstName"></mw-form-slot>
    </div>

    <div style="background-color: yellow">
        Field 2
        <mw-form-slot fieldName="surname"></mw-form-slot>
    </div>



</mw-form-builder>
<button (click)="myForm.submit()">submit</button>
```

(Yes, docs are also alpha 😅)

## Contribution
Feel free to contribute

## Tests
Aren't written yet 😬
