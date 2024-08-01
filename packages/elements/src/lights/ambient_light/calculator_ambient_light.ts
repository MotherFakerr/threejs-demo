import { AbstractCalculator, AbstractGeoElement, CalculatorMgr, GAmbientLight, ICalculatorWatchProperties } from '@threejs-demo/core';
import { AmbientLightDB } from './ambient_light_db';

@CalculatorMgr.registerCalculator(AmbientLightDB)
export class CalculatorAmbientLight extends AbstractCalculator<AmbientLightDB> {
    public async execute(db: AmbientLightDB): Promise<AbstractGeoElement[]> {
        const { color, intensity } = db;
        const renderer = db.getDoc().getRenderDoc();
        const geo = renderer.createGeoElement(GAmbientLight, { color, intensity });
        db.setGeoElements([geo]);
        return [geo];
    }

    protected _watch(): ICalculatorWatchProperties<AmbientLightDB>[] {
        return ['color', 'intensity'];
    }
}
