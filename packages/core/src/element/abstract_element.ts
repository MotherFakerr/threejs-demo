import { ISysDocument } from '../sys_document';
import { ElementId } from './element_id';
import { IElement } from './interface';

export abstract class AbstractElement implements IElement {
    private _id: ElementId;

    private _doc: ISysDocument;
}
