import { ElementIdPool } from './id_pool';

export class ElementId {
    private _id: number;

    constructor(idPool: ElementIdPool) {
        this._id = idPool.generateId();
    }

    public toNum(): number {
        return this._id;
    }
}
