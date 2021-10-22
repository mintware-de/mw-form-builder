import {AbstractType, FormModel} from './form-type/abstract-type';
import {DummyField} from './dummy-field/dummy-field.type';
import {AbstractGroupType} from './form-type/abstract-group-type';
import {AbstractLayoutType} from './form-type/abstract-layout-type';
import {AbstractCollectionType} from './form-type/abstract-collection-type';

export class ModelMerger<T> {

  constructor(private model: FormModel<T>,
              private formData: T) {
  }

  private static getNextLevelFields<Y>(newModel: FormModel<Y>): { [key: string]: AbstractType<any> } {
    const result = {};
    const modelsToCheck = [newModel];

    for (const m of modelsToCheck) {
      for (const key of Object.keys(m)) {
        const el = m[key];
        if (el instanceof AbstractLayoutType) {
          modelsToCheck.push(el.options.model);
        }
        result[key] = el;
      }
    }
    return result;
  }

  public merge(): FormModel<T> {
    const newModel = {...this.model};
    if (!this.formData) {
      return newModel;
    }

    this.handleObject(newModel, this.formData);

    return newModel;
  }

  private handleObject<Y>(newModel: FormModel<Y>,
                          obj: Y,
  ): void {
    if (obj == null) {
      return;
    }

    const nextLevelFields = ModelMerger.getNextLevelFields(newModel);
    const keys = Array.from(new Set([...Object.keys(obj), ...Object.keys(newModel)]));
    for (const key of keys) {
      if (!(key in nextLevelFields)) {
        newModel[key] = new DummyField();
      }
    }
    for (const key of keys) {
      const fieldType = newModel[key];
      if (fieldType instanceof AbstractLayoutType) {
        this.handleObject(fieldType.options.model, Object.keys(obj).filter((k) =>
          !(k in newModel)
        ).reduce((res, k) => ({...res, [k]: obj[k]}), {}));
      } else if (fieldType instanceof AbstractGroupType) {
        this.handleObject(fieldType.options.model, obj[key]);
      } else if (fieldType instanceof AbstractCollectionType) {
        this.handleArray(fieldType.fieldInstance, obj[key]);
      }
    }

  }

  private handleArray<X>(fieldInstance: AbstractType<any>, array: X[]): void {
    if (array == null) {
      return;
    }
    const allKeys = Array.from(new Set(array.reduce((res, curr) => [...res, ...Object.keys(curr)], [])));
    if (fieldInstance instanceof AbstractLayoutType) {
      this.handleObject(fieldInstance.options.model, allKeys.reduce((tmp: {}, k: string) => ({...tmp, [k]: null}), {}));
    } else if (fieldInstance instanceof AbstractGroupType) {
      this.handleObject(fieldInstance.options.model, allKeys.reduce((tmp: {}, k: string) => ({...tmp, [k]: null}), {}));
    } else if (fieldInstance instanceof AbstractCollectionType) {
      this.handleArray(fieldInstance.fieldInstance, allKeys.reduce((tmp: {}, k: string) => {
        const existing = array.find(x => k in x && x[k] != null);
        return ({
          ...tmp,
          [k]: existing != null ? existing[k] : null,
        });
      }, {}));
    }
  }
}
