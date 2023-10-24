import { AbstractUniqueElement, AbstractUniqueGraphicElement } from '../element';
import { ElementClass, IAbstractElement, UniqueElementClass, UniqueGraphicElementClass } from '../element/interface';
import { AbstractGeoElement, IAbstractGeoElementInit } from '../geo_element/abstract_geo_element';
import { GElementClass } from '../geo_element/interface';
import { ElementId } from '../id/element_id';
import { ElementIdPool } from '../id/id_pool';
import { ISysView } from '../sys_view';
import { ElementMgr } from './element_mgr';
import { ISysDocument } from './interface';

export class SysDocument implements ISysDocument {
    private readonly _elementMgr: ElementMgr;

    private readonly _idPool: ElementIdPool;

    private _view: ISysView;

    constructor(view: ISysView) {
        this._view = view;
        this._idPool = new ElementIdPool();
        this._elementMgr = new ElementMgr();
    }

    public getSysView(): ISysView {
        return this._view;
    }

    public async createElement<T extends IAbstractElement>(Ctor: ElementClass<T>, params: Parameters<T['create']>[0]): Promise<T> {
        const element = await new Ctor(this as ISysDocument, this._idPool).create({ ...params });
        this._elementMgr.addElements(element);
        return element;
    }

    public getElementById(eleId: number | ElementId): IAbstractElement | undefined {
        const id = eleId instanceof ElementId ? eleId.toNum() : eleId;
        return this._elementMgr.getElementById(id);
    }

    public getElementsByIds(...eleIds: (number | ElementId)[]): IAbstractElement[] {
        const ids = eleIds.map((id) => (id instanceof ElementId ? id.toNum() : id));
        return this._elementMgr.getElementsByIds(...ids);
    }

    public delElementsByIds(...eleIds: (number | ElementId)[]): void {
        const ids = eleIds.map((id) => (id instanceof ElementId ? id.toNum() : id));
        this._elementMgr.delElementsByIds(...ids);
        this._idPool.recycleIds(...ids);
    }

    public getAllElements(): IAbstractElement[] {
        return this._elementMgr.getAllElements();
    }

    public getOrCreateUniqueElement<T extends AbstractUniqueElement>(Ctor: UniqueElementClass<T>): T {
        let element = this._elementMgr.getUniqueElementByCtor<T>(Ctor);
        if (!element) {
            element = new Ctor(this as ISysDocument, this._idPool);
            this._elementMgr.addUniqueElementByCtor(Ctor, element);
        }
        return element;
    }

    public getOrCreateUniqueGraphicElement<T extends AbstractUniqueGraphicElement>(Ctor: UniqueGraphicElementClass<T>): T {
        let element = this._elementMgr.getUniqueElementByCtor<T>(Ctor);
        if (!element) {
            element = new Ctor(this as ISysDocument, this._idPool);
            this._elementMgr.addUniqueElementByCtor(Ctor, element);
        }
        return element;
    }

    public createGeoElement<T extends AbstractGeoElement>(
        Ctor: GElementClass<T>,
        params: Omit<Parameters<T['create']>[0], keyof IAbstractGeoElementInit>,
    ): T {
        const renderer = this.getSysView().getRenderer();
        return renderer.createGeoElement<T>(Ctor, params);
    }
}
