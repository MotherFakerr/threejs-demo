import { ElementId } from '../id/element_id';
import { IRenderer } from '../renderer/interface';
import { ISysDocument } from '../sys_document/interface';
import { ISysView } from '../sys_view';

export interface IAbstractDB {
    id: ElementId;
    getDoc(): ISysDocument;
    getView(): ISysView;
    getRenderer(): IRenderer;
    dump(): KV;
}

export type ElementDBClass<T extends IAbstractDB = IAbstractDB> = {
    new (view: ISysView, id: ElementId): T;
};
