import { AbstractCalculator, AbstractGeoElement, CalculatorMgr, GAmbientLight, ICalculatorWatchProperties } from '@threejs-demo/core';
import { AmbientLightElement } from './ambient_light';

@CalculatorMgr.registerCalculator(AmbientLightElement)
export class CalculatorAmbientLight extends AbstractCalculator<AmbientLightElement> {
    public async execute(element: AmbientLightElement): Promise<AbstractGeoElement[]> {
        const { color, intensity } = element;
        const renderer = element.getCurDoc().getSysView().getRenderer();
        const geo = renderer.createGeoElement(GAmbientLight, { color, intensity });
        element.setGeoElements([geo]);
        return [geo];
    }

    protected _watch(): ICalculatorWatchProperties<AmbientLightElement>[] {
        return ['color', 'intensity'];
    }
}
