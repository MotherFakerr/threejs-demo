import { IAbstractDB, IAbstractGraphicDB } from '../database/interface';
import { ElementId } from '../id/element_id';
import { ElementIdPool } from '../id/id_pool';
import { IRenderDocument } from '../renderer/i_render_document';
import { ISysDocument } from '../sys_document/interface';
import { ISysView } from '../sys_view/interface';
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
    create(args: IElementCreateArgs): Promise<this>;
    update(args: IElementUpdateArgs, disableRender?: boolean): Promise<this>;
    getDoc(): ISysDocument;
    getView(): ISysView;
    getRenderDoc(): IRenderDocument;
}

export interface IAbstractGraphicElement<D extends IAbstractGraphicDB = IAbstractGraphicDB> extends IAbstractElement {
    db: D;
}

export type ElementClass<T extends IAbstractElement = IAbstractElement> = {
    new (view: ISysView, idPool: ElementIdPool): T;
};

export type UniqueElementClass<T extends AbstractUniqueElement = AbstractUniqueElement> = {
    new (view: ISysView, idPool: ElementIdPool): T;
};

export type UniqueGraphicElementClass<T extends AbstractUniqueGraphicElement = AbstractUniqueGraphicElement> = {
    new (view: ISysView, idPool: ElementIdPool): T;
};
