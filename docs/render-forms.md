## Rendering forms
Create a form model:

```typescript
export class AppComponent {
  public formModel: FormModel = {
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
                 [mwFormData]="data"
                 [mwFormModel]="formModel"
                 (mwFormSubmit)="submit($event)">
</mw-form-builder>
<button (click)="myForm.submit()">submit</button>
<!-- Submit will also check the validity -->
```

You can also render the fields where you want:


```html
<mw-form-builder #myForm
                 [mwFormData]="data"
                 [mwFormModel]="formModel"
                 (mwFormSubmit)="submit($event)">

    <div style="background-color: red">
        Field 1
        <ng-container mwFormSlot mwFieldName="firstName"></ng-container>
    </div>

    <div style="background-color: yellow">
        Field 2
        <ng-container mwFormSlot mwFieldName="surname"></ng-container>
    </div>



</mw-form-builder>
<button (click)="myForm.submit()">submit</button>
```
