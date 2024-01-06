import { IRenderDocument } from '../renderer/i_render_document';
import { RenderDocument } from '../renderer/render_document';
import { ISysDocument, SysDocument } from '../sys_document';
import { ISysView, ISysViewOptions } from './interface';

export class SysView implements ISysView {
    private _renderDocument: IRenderDocument;

    private _document: ISysDocument;

    constructor(private _container: HTMLElement, options: ISysViewOptions = {}) {
        this._renderDocument = new RenderDocument(this._container, options);
        this._document = new SysDocument(this);
    }

    public getRenderer(): IRenderDocument {
        return this._renderDocument;
    }

    public getDocument(): ISysDocument {
        return this._document;
    }

    public updateView(): void {
        this._renderDocument.updateView();
    }
}
