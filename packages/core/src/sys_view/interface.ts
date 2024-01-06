import { IRenderDocument, IThreeRenderOptions } from '../renderer/i_render_document';
import { ISysDocument } from '../sys_document/interface';

export interface ISysView {
    getRenderer(): IRenderDocument;
    getDocument(): ISysDocument;
    updateView(): void;
}

export type ISysViewOptions = IThreeRenderOptions;
