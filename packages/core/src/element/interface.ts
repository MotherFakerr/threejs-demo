import { IAbstractDB, IAbstractGenericDB, IAbstractGraphicDB } from '../database/interface';
import { ElementId } from '../id/element_id';
import { ElementIdPool } from '../id/id_pool';
import { IRenderDocument } from '../renderer/i_render_document';
import { ISysDocument } from '../sys_document/interface';
import { AbstractUniqueElement } from './abstract_unique_element';
import { AbstractUniqueGraphicElement } from './abstract_unique_graphic_element';

export interface IElementCreateArgs {
    [k: string]: ANY;
}

export interface IElementUpdateArgs {
    [k: string]: ANY;
}

export interface IAbstractElement<D extends IAbstractDB = IAbstractDB> {
    id: ElementId;
    db: D;
    initElement(args: IElementCreateArgs, disableRender?: boolean): Promise<this>;
    updateElement(args: IElementUpdateArgs, disableRender?: boolean): Promise<this>;
    getDoc(): ISysDocument;
    getRenderDoc(): IRenderDocument;
}

export interface IAbstractGenericElement<D extends IAbstractGenericDB = IAbstractGenericDB> extends IAbstractElement {
    db: D;
}

export interface IAbstractGraphicElement<D extends IAbstractGraphicDB = IAbstractGraphicDB> extends IAbstractElement {
    db: D;
}

export type ElementClass<T extends IAbstractElement = IAbstractElement> = {
    new (doc: ISysDocument, idPool: ElementIdPool): T;
};

export type UniqueElementClass<T extends AbstractUniqueElement = AbstractUniqueElement> = {
    new (doc: ISysDocument, idPool: ElementIdPool): T;
};

export type UniqueGraphicElementClass<T extends AbstractUniqueGraphicElement = AbstractUniqueGraphicElement> = {
    new (doc: ISysDocument, idPool: ElementIdPool): T;
};
