import { AbstractCalculator, AbstractGeoElement, CalculatorMgr, GPointLight, ICalculatorWatchProperties } from '@threejs-demo/core';
import { PointLightElement } from './point_light';

@CalculatorMgr.registerCalculator(PointLightElement)
export class CalculatorPointLight extends AbstractCalculator<PointLightElement> {
    public async execute(element: PointLightElement): Promise<AbstractGeoElement[]> {
        const { color, intensity, position } = element;
        const renderer = element.getCurDoc().getSysView().getRenderer();
        const geo = renderer.createGeoElement(GPointLight, { color, intensity, position });
        element.setGeoElements([geo]);
        return [geo];
    }

    protected _watch(): ICalculatorWatchProperties<PointLightElement>[] {
        return ['color', 'intensity'];
    }
}
