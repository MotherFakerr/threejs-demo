import { IRenderer, IThreeRenderOptions } from '../renderer/interface';
import { ISysDocument } from '../sys_document/interface';

export interface ISysView {
    getRenderer(): IRenderer;
    getDocument(): ISysDocument;
    updateView(): void;
    updateCamera(): void;
    resize(): void;
}

export interface ISysViewOptions extends IThreeRenderOptions {
    autoResize?: boolean;
}
