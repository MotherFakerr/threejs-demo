import { AbstractUniqueGraphicElement } from '@threejs-demo/core';
import { Vector3 } from '@threejs-demo/math';
import * as THREE from 'three';

export interface IPointLightParams {
    position: THREE.Vector3;
    color?: number;
    intensity?: number;
    distance?: number;
    decay?: number;
}

export class PointLightElement extends AbstractUniqueGraphicElement {
    public position = Vector3.O();

    public color = 0;

    public intensity = 0;

    public distance = 0;

    public decay = 0;

    public async create(params: IPointLightParams): Promise<this> {
        const { position, color, intensity, distance, decay } = params;
        this.position = position ?? new Vector3();
        this.color = color ?? 0xfffff;
        this.intensity = intensity ?? 0;

        await this.executeCalculators(params);
        return this;
    }

    public async update(params: IPointLightParams, disableUpdate = true): Promise<this> {
        const { color, intensity } = params;
        if (color) this.color = color;
        if (intensity) this.intensity = intensity;

        if (disableUpdate) {
            await this.executeCalculators(params);
        }

        return this;
    }
}
