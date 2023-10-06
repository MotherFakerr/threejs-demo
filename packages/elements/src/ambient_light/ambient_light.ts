import { AbstractUniqueElement, GAmbientLight } from '@threejs-demo/core';

export interface IAmbientLightParams {
    color: number;
    intensity?: number;
}

export class AmbientLightElement extends AbstractUniqueElement {
    public color = 0;

    public intensity = 0;

    public create({ color, intensity }: IAmbientLightParams): this {
        this.color = color;
        this.intensity = intensity ?? 0;

        this.getCurDoc().getSysView().getRenderer().createGeoElement(GAmbientLight, { color, intensity });
        return this;
    }
}
