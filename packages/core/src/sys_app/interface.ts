import { ISysView, ISysViewOptions } from '../sys_view/interface';

export interface ISysApp {
    initApp(): void;
    getViewById(id: string): ISysView | undefined;
    delViewById(id: string): void;
    createView(id: string, container: HTMLElement, options?: ISysViewOptions): ISysView;
}
