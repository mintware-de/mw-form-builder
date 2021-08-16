# Changelog

## 3.1.1

Fix:
- Merged the fixes from v2.2.2

## 2.2.2

Fix:
- Fixed the rebuild on changes

## 3.1.0

Feature:
- Added a Pre Submit Handler

## 2.2.1

Fix:
- Fixed the compatibility for pre-Ivy apps.

## 2.2.0

Feature:
- Added a Pre Submit Handler

## 3.0.0

Feature:
- Updated the peerDependencies for Angular 12

Change:
- Extracted an interface of the FormBuilderComponent to remove a cyclic dependency.

BREAKING CHANGE:
- Dropped support for Angular <10.0.0

## 2.1.3

Fix:
- Fixed the order of the form fields in Firefox.

## 2.1.2

Change:
- Added type arguments to `AbstractCollectionComponent`

Fix:
- Using `FormArray.push(...)` instead of `FormArray.controls.push(...)` to ensure FormGroup updates.  

## 2.1.1

Fix:
- The builderInstance field was not set on AbstractLayoutType

## 2.1.0

Features:
- Added a Type Parameter for the FormModel to improve autocomplete.
- Added Angular 10 and 11 version constraints to the package.json

## 2.0.1

Fix:
- Fixed ExpressionChangedAfterItHasBeenCheckedError.

Change:
- Copyright updated.
- Added shorthand getters for valid and invalid.

## 2.0.0

Change
- Added a version constraint for Angular 9

## 2.0.0-beta6

Fix
- Recursive form validation fixed
- Fixed change detection of dynamic created components 

## 2.0.0-beta5

Fix
- The content of `mwFormSlot` and `mwFormField` on non `ng-content` tags will be projected inside the host element

## 2.0.0-beta4

Fixed component rendering:
- `mw-form-slot` and `mw-form-field` isn't rendered anymore in the dom

BREAKING CHANGE:
- `mw-form-slot` Component is now a **Directive**!
  - To fix your templates replace
    - `<mw-form-slot` with `<div><ng-container mwFormSlot`
    - `mw-form-slot>` with `ng-container></div>`

- `mw-form-field` Component is now a **Directive**!
  - To fix your templates replace
    - `<mw-form-field` with `<div><ng-container mwFormField`
    - `mw-form-field>` with `ng-container></div>`


- AbstractFormGroupComponent
  - `mwIsRootGroup` -> removed
  
## 2.0.0-beta3

Bugfix:
- Nested elements will be rendered correctly

## 2.0.0-beta2

Changes:
- `AbstractFormGroupComponent`
  - Made `cfr` and `cdr` protected.
- `CollectionFormFieldComponent`
  - Made `cdr` protected.
- `InitHandler`
  - Made `instance` protected.


BREAKING CHANGE:
Added parameter prefix to prevent name collision. 
I know that means a lot of work for you but it's necessary to reduce future bugs.

- AbstractFormFieldComponent
  - `formGroup` -> `mwFormGroup`
  - `element` -> `mwElement`
  - `index` -> `mwIndex`
  - `fieldType` -> `mwFieldType`
  - `path` -> `mwPath`
  - `slots` -> `mwSlots`

- AbstractFormGroupComponent
  - `element` -> `mwElement`
  - `isRootGroup` -> `mwIsRootGroup`
  
- FormSlotComponent
  - `fieldName` -> `mwFieldName`

## 2.0.0-beta1

Features:
- Introducing the new `AbstractLayoutType`. For details check the [example](./docs/layout-types.md).
- Added `AbstractLayoutComponent`

Changes:
- Extracted FormGroup logic into the `AbstractFormGroupComponent`

BREAKING CHANGE:
- `model` property removed from the `mw-form-group` component. Use `fieldType` instead.
- `AbstractGroupFormField` renamed to `AbstractFormGroupComponent`
- `AbstractCollectionFormFieldComponent` renamed to `AbstractCollectionComponent`

## 1.1.0-beta4
Code cleanup
- Created `Constructor` types instead of using `new (...args: any[]) => any`
- Using the `ModelHandler` in the `AbstractCollectionFormFieldComponent`
- Created a `AbstractFormControl` type to reduce usage of any
- Set the return Type of the onSubmit EventEmitter in the form explicitly
- Using the `ModelHandler` in the `FormComponent.initializeCollectionField` method
- Made `ModelHandler.buildSingleField` public
- Removed a lot of `as` and using `instanceof` instead

## 1.1.0-beta3
- Fixed FormGroup, FormControl and FormArray initialization when the form was rebuild
- Added a `control` field to the AbstractType which holds the form control 

## 1.1.0-beta2
Fixed wrong bool check in FormControl abstractions

## 1.1.0-beta1
Improved performance
- Created own FormArray, FormGroup and FormControl which extends from the default Angular classes.
- This abstractions blocks the `updateValueAndValidity` calls until the form rendering has finished
- Checking in the `FormGroupComponent.ngAfterViewInit` hook, if the form was already rendered and block unnecessary rebuilding.

Other changes:
- Replaced `x.hasOwnProperty('y')` by `'y' in x` and replaced `if (x != null)` by `if (x)` to improve the readability.
- Added `asyncValidators` and `updateOn` to the AbstractType and made `validators` non abstract

## 1.0.0
Thanks to [@billbeeio](https://github.com/billbeeio) for many improvements ([PR#1](https://github.com/mintware-de/mw-form-builder/pull/1))

Overall:
- Docs updated
- Abstract components added
- Abstract field types added
- Added FormArray type and FormGroup type. This allows to build complex and reusable form models.
- added the `getErrors` method to the form builder. It returns all validation errors as a nested object

## 0.0.2
Initial Release
