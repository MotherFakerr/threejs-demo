import { AbstractCalculator, AbstractGeoElement, CalculatorMgr, ICalculatorWatchProperties } from '@threejs-demo/core';
import { AmbientLightElement } from './ambient_light';

@CalculatorMgr.registerCalculator(AmbientLightElement)
export class CalculatorAmbientLight extends AbstractCalculator<AmbientLightElement> {
    public async execute(element: AmbientLightElement): Promise<AbstractGeoElement[]> {
        return [];
    }

    protected _watch(): ICalculatorWatchProperties<AmbientLightElement>[] {
        return ['color', 'intensity'];
    }
}
