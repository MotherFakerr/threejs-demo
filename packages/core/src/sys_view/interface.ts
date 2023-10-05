import { IRenderer, IThreeRenderOptions } from '../renderer';

export interface ISysView {
    getRenderer(): IRenderer;
    updateView(): void;
    updateCamera(): void;
    resize(): void;
}

export interface ISysViewOptions extends IThreeRenderOptions {
    autoResize?: boolean;
}
