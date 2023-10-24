import { AbstractUniqueGraphicElement, GAmbientLight } from '@threejs-demo/core';

export interface IAmbientLightParams {
    color?: number;
    intensity?: number;
}

export class AmbientLightElement extends AbstractUniqueGraphicElement {
    public color = 0;

    public intensity = 0;

    public async create(params: IAmbientLightParams): Promise<this> {
        const { color, intensity } = params;
        this.color = color ?? 0xfffff;
        this.intensity = intensity ?? 0;

        await this.executeCalculators(params);
        return this;
    }

    public async update(params: IAmbientLightParams, disableUpdate = true): Promise<this> {
        const { color, intensity } = params;
        if (color) this.color = color;
        if (intensity) this.intensity = intensity;

        if (disableUpdate) {
            await this.executeCalculators(params);
        }

        return this;
    }
}
