import { IAbstractGraphicElement } from '../element';
import { AbstractGeoElement } from '../geo_element';
import { ICalculator, ICalculatorWatchProperties } from './interface';

export abstract class AbstractCalculator<T extends IAbstractGraphicElement> implements ICalculator<T> {
    public ifUpdate(keys: string[]): boolean {
        const watchKeys = this._watch() as string[];
        return !!keys.find((key) => watchKeys.includes(key));
    }

    public abstract execute(element: T): Promise<AbstractGeoElement[]>;

    protected abstract _watch(): ICalculatorWatchProperties<T>[];
}
