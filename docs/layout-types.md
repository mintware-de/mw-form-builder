## Creating layout types
In the most cases the structure of the form data differ from the form model. 

For example the form data object looks like that:
```typescript
const formData = {
  firstName: 'John',
  lastName: 'Doe',
  street: '3987  Monroe Street',
  city: 'Houston',
  state: 'TX',
  zipCode: '77030',
};
```

Instead of render all fields under each other, you want to show the name fields on the left
and the address fields on the right.

| Left Side  | Right side      |
| :--------- | :-------------- |
| First name | Street          |
| Last name  | Zip Code / City |
|            | State           |

Instead of using form slots (`<mw-form-slot fieldName="..."></mw-form-slot>`) you can create 
a row and column layout type and use it in the form model.

Simplified pseudo example of the `FormModel` 
```typescript
RowLayout({
    _leftSide: ColumnLayout({
        firstName: TextField,
        lastName: TextField,
    }),
    _rightSide: ColumnLayout({
        street: TextField,
        _zipCity: RowLayout({
            zipCode: TextField,
            city: TextField,        
        }),
        state: TextField,
    }),
});
```
`RowLayout` and `ColumnLayout` are instances of `LayoutType`.
The form builder will skip LayoutTypes for data resolution.

### Example
Complete code example
```typescript
import {
  AbstractLayoutType,
  Constructor,
  FormModel,
  IGroupTypeOptions,
  AbstractLayoutComponent,
} from 'mw-form-builder';
import {Component} from '@angular/core';

/**
 * General interface for the options.
 * The layout uses flex box and the children can be displayed as a row or a column
 */
interface ILayoutOptions extends IGroupTypeOptions {
  direction: 'row' | 'column';
}

/** General Layout type */
abstract class RowColumnLayout extends AbstractLayoutType<ILayoutOptions> {
  readonly component: Constructor = RowColumnLayoutComponent;
}

/** Interface with options for the row layout */
export interface IRowLayoutOptions {
  columns: FormModel;
}

/** Row layout form type. This is used in the FormModel */
export class RowLayout extends RowColumnLayout {
  constructor(options: IRowLayoutOptions) {
    super({
      direction: 'row',
      model: options.columns
    });
  }
}

/** Interface with options for the column layout */
export interface IColumnLayoutOptions {
  rows: FormModel;
}

/** Column layout form type. This is used in the FormModel */
export class ColumnLayout extends RowColumnLayout {
  constructor(options: IColumnLayoutOptions) {
    super({
      direction: 'column',
      model: options.rows
    });
  }
}

/** The layout component */
@Component({
  selector: 'app-row-column-layout',
  template: `
    <!-- Outer flex container. -->
    <div style="display: flex; align-items: start; align-content: center;justify-content: space-around;"
         [ngStyle]="{'flex-direction': fieldType.options.direction}">
      <!-- Loop over the children -->
      <div style="flex: 1" *ngFor="let kv of fieldType.options.model | keyvalue:orderAsGiven">
        <!-- And create a mw-form-field for each children -->
        <mw-form-field [fieldType]="kv.value"
                       [slots]="slots"
                       [index]="indexFromParent"
                       [formGroup]="formGroup"
                       [path]="fieldPaths[kv.key]"
                       [element]="elements[kv.key]">
        </mw-form-field>
      </div>
    </div>
  `
})
export class RowColumnLayoutComponent extends AbstractLayoutComponent<RowColumnLayout> {
}
```


Usage:
```typescript
import {Component} from '@angular/core';
import {TextFormType} from './form-type/text.form-type';
import {ColumnLayout, RowLayout} from './form-type/layout.form-type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  public formData: any = {
    firstName: 'John',
    lastName: 'Doe',
    street: '3987  Monroe Street',
    city: 'Houston',
    state: 'TX',
    zipCode: '77030',
  };

  public formModel: { [key: string]: any } = {
    _row: new RowLayout({
      columns: {
        _leftSide: new ColumnLayout({
          rows: {
            firstName: new TextFormType({
              label: 'First name',
            }),
            lastName: new TextFormType({
              label: 'Last name',
            }),
          }
        }),
        _rightSide: new ColumnLayout({
          rows: {
            street: new TextFormType({
              label: 'Street',
            }),
            _zipCity: new RowLayout({
              columns: {
                zipCode: new TextFormType({
                  label: 'Zip code',
                }),
                city: new TextFormType({
                  label: 'City',
                }),
              }
            }),
            state: new TextFormType({
              label: 'State',
            }),
          }
        }),
      },
    }),
  };
}
```
