import { ElementId } from '../element/element_id';
import { IElement } from '../element/interface';

export interface ISysDocument {
    getElementById(eleId: number | ElementId): IElement | undefined;
}
