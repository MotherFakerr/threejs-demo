import { DBManager } from '../database';
import { IAbstractDB } from '../database/interface';
import { ElementId } from '../id/element_id';
import { ElementIdPool } from '../id/id_pool';
import { IRenderDocument } from '../renderer';
import { ISysDocument } from '../sys_document/interface';
import { ISysView } from '../sys_view';
import { ElementClass, IAbstractElement, IElementCreateArgs, IElementUpdateArgs } from './interface';

export abstract class AbstractElement<D extends IAbstractDB, C extends IElementCreateArgs, U extends IElementUpdateArgs>
    implements IAbstractElement<D>
{
    protected _view: ISysView;

    protected _db: D;

    private _dbEditable = false;

    constructor(view: ISysView, idPool: ElementIdPool) {
        this._view = view;
        // eslint-disable-next-line no-proto
        const Ctor = (this as ANY).__proto__.constructor as ElementClass;
        const DbCtor = DBManager.getDBCtor(Ctor);
        this._db = new Proxy(new DbCtor(view, new ElementId(idPool)) as D, {
            set: (target: D, p: string, value) => {
                if (p === '_id' || p === '_view') {
                    throw new Error("id & view can't be edited");
                }

                if (!this._dbEditable) {
                    throw new Error("db should be edited through element's update method!!!");
                }

                // eslint-disable-next-line no-param-reassign
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
        return this._view.getDocument();
    }

    public getView(): ISysView {
        return this._view;
    }

    public getRenderer(): IRenderDocument {
        return this._view.getRenderer();
    }

    public async create(args: C): Promise<this> {
        this._dbEditable = true;
        await this._createDB(args);
        this._dbEditable = false;
        return this;
    }

    public async update(args: U): Promise<this> {
        this._dbEditable = true;
        await this._updateDB(args);
        this._dbEditable = false;
        return this;
    }

    protected abstract _createDB(args: C): Promise<void>;

    protected abstract _updateDB(args: U): Promise<void>;
}
