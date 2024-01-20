import { IAbstractElement } from '../element';
import { ElementId } from '../id';
import { IRenderDocument } from '../renderer/i_render_document';
import { ISysDocument } from '../sys_document/interface';
import { ISysView } from '../sys_view/interface';
import { IAbstractDB } from './interface';

export abstract class AbstractDB implements IAbstractDB {
    protected _view: ISysView;

    protected _id: ElementId;

    constructor(view: ISysView, id: ElementId) {
        this._view = view;
        this._id = id;
    }

    public get id(): ElementId {
        return this._id;
    }

    public getDoc(): ISysDocument {
        return this._view.getDocument();
    }

    public getView(): ISysView {
        return this._view;
    }

    public getRenderDoc(): IRenderDocument {
        return this._view.getRenderDoc();
    }

    public getElement(): IAbstractElement {
        return this.getDoc().getElementById(this._id)!;
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
