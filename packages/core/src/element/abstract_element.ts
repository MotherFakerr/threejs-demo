import { ElementId } from '../id/element_id';
import { ElementIdPool } from '../id/id_pool';
import { ISysDocument } from '../sys_document/interface';
import { IAbstractElement } from './interface';

export abstract class AbstractElement implements IAbstractElement {
    protected _id: ElementId;

    protected _doc: ISysDocument;

    constructor(doc: ISysDocument, idPool: ElementIdPool) {
        this._doc = doc;
        this._id = new ElementId(idPool);
    }

    public get id(): ElementId {
        return this._id;
    }

    public getCurDoc(): ISysDocument {
        return this._doc;
    }

    public abstract create(args: ANY): this;

    public abstract update(args: ANY, disableUpdate?: boolean): Promise<this>;
}
