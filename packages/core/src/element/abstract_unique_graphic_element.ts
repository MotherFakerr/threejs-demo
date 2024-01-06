import { IAbstractGraphicDB } from '../database/interface';
import { AbstractGraphicElement } from './abstract_graphic_element';
import { IElementCreateArgs, IElementUpdateArgs } from './interface';

export abstract class AbstractUniqueGraphicElement<
    D extends IAbstractGraphicDB = IAbstractGraphicDB,
    C extends IElementCreateArgs = IElementCreateArgs,
    U extends IElementUpdateArgs = Partial<C>,
> extends AbstractGraphicElement<D, C, U> {}
