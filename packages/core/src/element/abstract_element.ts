import { AbstractDB, DBManager } from '../database';
import { ElementId } from '../id/element_id';
import { ElementIdPool } from '../id/id_pool';
import { IRenderer } from '../renderer';
import { ISysDocument } from '../sys_document/interface';
import { ISysView } from '../sys_view';
import { ElementClass, IAbstractElement, IElementCreateArgs, IElementUpdateArgs } from './interface';

export abstract class AbstractElement<D extends AbstractDB, C extends IElementCreateArgs, U extends IElementUpdateArgs>
    implements IAbstractElement
{
    protected _view: ISysView;

    protected _db: D;

    constructor(view: ISysView, idPool: ElementIdPool) {
        this._view = view;
        // eslint-disable-next-line no-proto
        const Ctor = (this as ANY).__proto__.constructor as ElementClass;
        const DbCtor = DBManager.getDBCtor(Ctor);
        this._db = new DbCtor(view, new ElementId(idPool)) as D;
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

    public getRenderer(): IRenderer {
        return this._view.getRenderer();
    }

    public async create(args: C): Promise<this> {
        await this._createDB(args);
        return this;
    }

    public async update(args: U): Promise<this> {
        await this._updateDB(args);
        return this;
    }

    protected abstract _createDB(args: C): Promise<void>;

    protected abstract _updateDB(args: U): Promise<void>;
}
