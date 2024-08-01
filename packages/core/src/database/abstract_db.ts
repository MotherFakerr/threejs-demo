import { ElementId } from '../id';
import { IRenderDocument } from '../renderer/i_render_document';
import { ISysDocument } from '../sys_document/interface';
import { IAbstractDB } from './interface';

export abstract class AbstractDB implements IAbstractDB {
    protected _doc: ISysDocument;

    protected _id: ElementId;

    constructor(doc: ISysDocument, id: ElementId) {
        this._doc = doc;
        this._id = id;
    }

    public get id(): ElementId {
        return this._id;
    }

    public getDoc(): ISysDocument {
        return this._doc;
    }

    public getRenderer(): IRenderDocument {
        return this._doc.getRenderer();
    }

    public dump(): KV {
        const res: KV = {};
        for (const key in this) {
            if (key.startsWith('_')) {
                continue;
            }
            res[key] = this[key];
        }

        return res;
    }
}
