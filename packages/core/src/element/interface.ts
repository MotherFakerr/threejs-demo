/* eslint-disable @typescript-eslint/no-empty-interface */
import { ElementId } from '../id/element_id';
import { ElementIdPool } from '../id/id_pool';
import { IRenderer } from '../renderer/interface';
import { ISysDocument } from '../sys_document/interface';
import { ISysView } from '../sys_view/interface';
import { AbstractUniqueElement } from './abstract_unique_element';
import { AbstractUniqueGraphicElement } from './abstract_unique_graphic_element';

export interface IElementCreateArgs {}

export interface IElementUpdateArgs {}

export interface IAbstractElement {
    id: ElementId;
    create(args: IElementCreateArgs): Promise<this>;
    update(args: IElementUpdateArgs, disableRender?: boolean): Promise<this>;
    getDoc(): ISysDocument;
    getView(): ISysView;
    getRenderer(): IRenderer;
}

export type IAbstractGraphicElement = IAbstractElement;

export type ElementClass<T extends IAbstractElement = IAbstractElement> = {
    new (view: ISysView, idPool: ElementIdPool): T;
};

export type UniqueElementClass<T extends AbstractUniqueElement = AbstractUniqueElement> = {
    new (view: ISysView, idPool: ElementIdPool): T;
};

export type UniqueGraphicElementClass<T extends AbstractUniqueGraphicElement = AbstractUniqueGraphicElement> = {
    new (view: ISysView, idPool: ElementIdPool): T;
};
