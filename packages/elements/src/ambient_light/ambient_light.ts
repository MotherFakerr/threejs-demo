import { AbstractUniqueGraphicElement, GAmbientLight } from '@threejs-demo/core';

export interface IAmbientLightParams {
    color?: number;
    intensity?: number;
}

export class AmbientLightElement extends AbstractUniqueGraphicElement {
    public color = 0;

    public intensity = 0;

    public create({ color, intensity }: IAmbientLightParams): this {
        this.color = color ?? 0xfffff;
        this.intensity = intensity ?? 0;

        const geo = this.getCurDoc().getSysView().getRenderer().createGeoElement(GAmbientLight, { color, intensity });
        this._geoElements = [geo];
        return this;
    }

    public update(params: IAmbientLightParams, disableUpdate = true): this {
        const { color, intensity } = params;
        if (color) this.color = color;
        if (intensity) this.intensity = intensity;

        this._calculatorObservers(params);

        return this;
    }
}
