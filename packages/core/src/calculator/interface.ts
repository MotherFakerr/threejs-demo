import { AbstractDB } from '../database/abstract_db';
import { IAbstractDB } from '../database/interface';
import { IAbstractGeoElement } from '../geo_element';

export type ICalculatorWatchProperties<T extends AbstractDB> = {
    [K in keyof T]: T[K] extends (...args: ANY[]) => ANY ? never : K;
}[keyof T];

export interface ICalculator<T extends IAbstractDB = IAbstractDB> {
    execute(element: T): Promise<IAbstractGeoElement[]>;
    ifUpdate(keys: string[]): boolean;
}
