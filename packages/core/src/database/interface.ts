import { AbstractGeoElement } from '../geo_element/abstract_geo_element';
import { ElementId } from '../id/element_id';
import { IRenderDocument } from '../renderer/i_render_document';
import { ISysDocument } from '../sys_document/interface';
import { ISysView } from '../sys_view';

export interface IAbstractDB {
    id: ElementId;
    getDoc(): ISysDocument;
    getView(): ISysView;
    getRenderDoc(): IRenderDocument;
    dump(): KV;
}
export interface IAbstractGraphicDB<T extends AbstractGeoElement = AbstractGeoElement> extends IAbstractDB {
    geoElements: T[];
}
export type ElementDBClass<T extends IAbstractDB = IAbstractDB> = {
    new (view: ISysView, id: ElementId): T;
};
