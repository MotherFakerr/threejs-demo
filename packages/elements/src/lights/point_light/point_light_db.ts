import { AbstractGraphicDB } from '@threejs-demo/core';
import { Vector3 } from '@threejs-demo/math';

export class PointLightDB extends AbstractGraphicDB {
    public position = Vector3.O();

    public color = 0;

    public intensity = 0;

    public distance = 0;

    public decay = 0;
}
