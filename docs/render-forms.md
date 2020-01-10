## Rendering forms
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
