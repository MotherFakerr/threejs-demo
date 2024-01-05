import { AbstractCalculator, AbstractGeoElement, CalculatorMgr, GPointLight, ICalculatorWatchProperties } from '@threejs-demo/core';
import { PointLightDB } from './point_light_db';

@CalculatorMgr.registerCalculator(PointLightDB)
export class CalculatorPointLight extends AbstractCalculator<PointLightDB> {
    public async execute(db: PointLightDB): Promise<AbstractGeoElement[]> {
        const { color, intensity, position } = db;
        const renderer = db.getRenderer();
        const geo = renderer.createGeoElement(GPointLight, { color, intensity, position });
        db.setGeoElements([geo]);
        return [geo];
    }

    protected _watch(): ICalculatorWatchProperties<PointLightDB>[] {
        return ['color', 'intensity'];
    }
}
