import { IAbstractGraphicElement } from '../element';
import { AbstractGeoElement } from '../geo_element';

export type ICalculatorWatchProperties<T> = keyof T;

export interface ICalculator<T extends IAbstractGraphicElement = IAbstractGraphicElement> {
    execute(element: T): Promise<AbstractGeoElement[]>;
    ifUpdate(keys: string[]): boolean;
}
