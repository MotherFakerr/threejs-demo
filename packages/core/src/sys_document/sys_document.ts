import { AbstractGraphicElement, AbstractUniqueElement, AbstractUniqueGraphicElement } from '../element';
import { ElementClass, IAbstractElement, UniqueElementClass, UniqueGraphicElementClass } from '../element/interface';
import { AbstractGeoElement, IAbstractGeoElementInit } from '../geo_element/abstract_geo_element';
import { GElementClass } from '../geo_element/interface';
import { ElementId } from '../id/element_id';
import { ElementIdPool } from '../id/id_pool';
import { IRenderDocument } from '../renderer';
import { ElementMgr } from './element_mgr';
import { ISysDocument } from './interface';

export class SysDocument implements ISysDocument {
    private readonly _elementMgr: ElementMgr;

    private readonly _idPool: ElementIdPool;

    private _renderDocument: IRenderDocument;

    constructor(renderDocument: IRenderDocument) {
        this._renderDocument = renderDocument;
        this._idPool = new ElementIdPool();
        this._elementMgr = new ElementMgr();
    }

    public getRenderer(): IRenderDocument {
        return this._renderDocument;
    }

    public async createElement<T extends IAbstractElement>(Ctor: ElementClass<T>, params: Parameters<T['initElement']>[0]): Promise<T> {
        const element = await new Ctor(this, this._idPool).initElement({ ...params });
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
        // 关联删除所有几何元素
        const geoElements = this._elementMgr.getElementsByIds(...ids).reduce((all, ele) => {
            if (ele instanceof AbstractGraphicElement) {
                all.push(...(ele as AbstractGraphicElement).db.geoElements);
                return all;
            }
            return all;
        }, [] as AbstractGeoElement[]);
        this.getRenderer().delGeoElementsByIds(...geoElements.map((ele) => ele.id));

        this._elementMgr.delElementsByIds(...ids);
        this._idPool.recycleIds(...ids);
    }

    public getAllElements(): IAbstractElement[] {
        return this._elementMgr.getAllElements();
    }

    public getOrCreateUniqueElement<T extends AbstractUniqueElement>(Ctor: UniqueElementClass<T>): T {
        let element = this._elementMgr.getUniqueElementByCtor<T>(Ctor);
        if (!element) {
            element = new Ctor(this, this._idPool);
            this._elementMgr.addUniqueElementByCtor(Ctor, element);
        }
        return element;
    }

    public getOrCreateUniqueGraphicElement<T extends AbstractUniqueGraphicElement>(Ctor: UniqueGraphicElementClass<T>): T {
        let element = this._elementMgr.getUniqueElementByCtor<T>(Ctor);
        if (!element) {
            element = new Ctor(this, this._idPool);
            this._elementMgr.addUniqueElementByCtor(Ctor, element);
        }
        return element;
    }

    public createGeoElement<T extends AbstractGeoElement>(
        Ctor: GElementClass<T>,
        params: Omit<Parameters<T['create']>[0], keyof IAbstractGeoElementInit>,
    ): T {
        const renderer = this.getRenderer();
        return renderer.createGeoElement<T>(Ctor, params);
    }
}
