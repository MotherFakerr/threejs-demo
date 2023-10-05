import { IElement } from '../element';
import { ElementId } from '../element/element_id';
import { ElementIdPool } from '../element/id_pool';
import { ISysDocument } from './interface';

export class SysDocument implements ISysDocument {
    private _idPool: ElementIdPool;

    private _elements = new Map<number, IElement>();

    constructor() {
        this._idPool = new ElementIdPool();
    }

    public getElementById(eleId: number | ElementId): IElement | undefined {
        const id = eleId instanceof ElementId ? eleId.toNum() : eleId;
        return this._elements.get(id);
    }
}
