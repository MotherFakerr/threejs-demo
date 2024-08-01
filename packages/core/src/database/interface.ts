import { AbstractGeoElement } from '../geo_element/abstract_geo_element';
import { ElementId } from '../id/element_id';
import { IRenderDocument } from '../renderer/i_render_document';
import { ISysDocument } from '../sys_document/interface';

export interface IAbstractDB {
    id: ElementId;
    getDoc(): ISysDocument;
    getRenderDoc(): IRenderDocument;
    dump(): KV;
}

export interface IAbstractGenericDB extends IAbstractDB {}
export interface IAbstractGraphicDB<T extends AbstractGeoElement = AbstractGeoElement> extends IAbstractDB {
    geoElements: T[];
}
export type ElementDBClass<T extends IAbstractDB = IAbstractDB> = {
    new (doc: ISysDocument, id: ElementId): T;
};
