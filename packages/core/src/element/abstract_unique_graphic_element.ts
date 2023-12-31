import { AbstractDB } from '../database';
import { AbstractGraphicElement } from './abstract_graphic_element';
import { IElementCreateArgs, IElementUpdateArgs } from './interface';

export abstract class AbstractUniqueGraphicElement<
    D extends AbstractDB = AbstractDB,
    C extends IElementCreateArgs = IElementCreateArgs,
    U extends IElementUpdateArgs = C,
> extends AbstractGraphicElement<D, C, U> {}
