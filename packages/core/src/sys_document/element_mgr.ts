import { AbstractUniqueElement } from '../element/abstract_unique_element';
import { IAbstractElement, UniqueElementClass } from '../element/interface';

export class ElementMgr {
    private _elements = new Map<number, IAbstractElement>();

    private _uniqueElements = new Map<UniqueElementClass, AbstractUniqueElement>();

    public getAllElements(): IAbstractElement[] {
        return [...this._elements.values()];
    }

    public addElements(...elements: IAbstractElement[]): void {
        for (const element of elements) {
            const id = element.id.toNum();
            this._elements.set(id, element);
        }
    }

    public getElementById(id: number): IAbstractElement | undefined {
        return this._elements.get(id);
    }

    public getElementsByIds(...ids: number[]): IAbstractElement[] {
        const res = [];
        for (const id of ids) {
            const element = this._elements.get(id);
            if (element) {
                res.push(element);
            }
        }

        return res;
    }

    public delElementsByIds(...ids: number[]): void {
        for (const id of ids) {
            this._elements.delete(id);
        }
    }

    public getUniqueElementByCtor<T extends AbstractUniqueElement>(Ctor: UniqueElementClass<T>): T | undefined {
        const element = this._uniqueElements.get(Ctor) as T;
        return element;
    }

    public addUniqueElementByCtor(Ctor: UniqueElementClass, element: AbstractUniqueElement): void {
        this._uniqueElements.set(Ctor, element);
    }
}
