import {
    AbstractCalculator,
    AbstractGeoElement,
    AnimationAction,
    AnimationClip,
    CalculatorMgr,
    ColorKeyframeTrack,
    GPointLight,
    ICalculatorWatchProperties,
} from '@threejs-demo/core';
import { PointLightDB } from './point_light_db';

@CalculatorMgr.registerCalculator(PointLightDB)
export class CalculatorPointLight extends AbstractCalculator<PointLightDB> {
    public async execute(db: PointLightDB): Promise<AbstractGeoElement[]> {
        const { color, intensity, position } = db;
        const renderDoc = db.getRenderDoc();
        const geo = renderDoc.createGeoElement(GPointLight, { color, intensity, position });
        const animationMixer = renderDoc.createAnimationMixer(geo);

        const test = new ColorKeyframeTrack('.color', [0, 3, 5], [0, 0, 0, 255, 255, 255, 0, 255, 1]);
        const clip = new AnimationClip('fuck', 5, [test]);
        const action = new AnimationAction(animationMixer.instance, clip);
        action.play();

        db.setGeoElements([geo]);
        return [geo];
    }

    protected _watch(): ICalculatorWatchProperties<PointLightDB>[] {
        return ['color', 'intensity'];
    }
}
