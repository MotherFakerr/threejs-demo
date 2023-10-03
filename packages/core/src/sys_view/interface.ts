import { IRenderer } from '../renderer';

export interface ISysView {
    getRenderer(): IRenderer;
    updateView(): void;
    updateCamera(): void;
    resize(): void;
}
