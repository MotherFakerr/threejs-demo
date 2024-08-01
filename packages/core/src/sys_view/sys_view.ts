import { IRenderDocument } from '../renderer/i_render_document';
import { RenderDocument } from '../renderer/render_document';
import { ISysDocument, SysDocument } from '../sys_document';
import { ISysView, ISysViewOptions } from './interface';

export class SysView implements ISysView {
    private _document: ISysDocument;

    constructor(private _container: HTMLElement, options: ISysViewOptions = {}) {
        const renderDocument = new RenderDocument(this._container, options);
        this._document = new SysDocument(renderDocument);
    }

    public getRenderDoc(): IRenderDocument {
        return this._document.getRenderDoc();
    }

    public getDocument(): ISysDocument {
        return this._document;
    }

    public updateView(): void {
        this.getRenderDoc().updateView();
    }
}
