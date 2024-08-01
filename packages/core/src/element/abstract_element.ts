import { DBManager } from '../database';
import { IAbstractDB } from '../database/interface';
import { ElementId } from '../id/element_id';
import { ElementIdPool } from '../id/id_pool';
import { IRenderDocument } from '../renderer';
import { ISysDocument } from '../sys_document/interface';
import { ElementClass, IAbstractElement, IElementCreateArgs, IElementUpdateArgs } from './interface';

export abstract class AbstractElement<D extends IAbstractDB, C extends IElementCreateArgs, U extends IElementUpdateArgs>
    implements IAbstractElement<D>
{
    protected _doc: ISysDocument;

    protected _db: D;

    private _dbEditable = false;

    constructor(doc: ISysDocument, idPool: ElementIdPool) {
        this._doc = doc;
        // eslint-disable-next-line no-proto
        const Ctor = (this as ANY).__proto__.constructor as ElementClass;
        const DbCtor = DBManager.getDBCtor(Ctor);
        this._db = new Proxy(new DbCtor(doc, new ElementId(idPool)) as D, {
            set: (target: D, p: string, value) => {
                if (p === '_id' || p === '_view') {
                    throw new Error("id & view can't be edited");
                }

                if (!this._dbEditable) {
                    throw new Error("db should be edited through element's updateElement method!!!");
                }

                target[p] = value;
                return true;
            },
        });
    }

    public get id(): ElementId {
        return this._db.id;
    }

    public get db(): D {
        return this._db;
    }

    public getDoc(): ISysDocument {
        return this._doc;
    }

    public getRenderDoc(): IRenderDocument {
        return this._doc.getRenderDoc();
    }

    protected async _safeInitDB(args: C): Promise<void> {
        this._dbEditable = true;
        await this._initDB(args);
        this._dbEditable = false;
    }

    protected async _safeUpdateDB(args: U): Promise<void> {
        this._dbEditable = true;
        await this._updateDB(args);
        this._dbEditable = false;
    }

    public abstract initElement(args: C, disableRender?: boolean): Promise<this>;

    public abstract updateElement(args: U, disableRender?: boolean): Promise<this>;

    protected abstract _initDB(args: C): Promise<void>;

    protected abstract _updateDB(args: U): Promise<void>;
}
