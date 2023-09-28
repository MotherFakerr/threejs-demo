import { ISysView } from '../sys_view/interface';

export interface ISysApp {
    initApp(): void;
    getViewById(id: string): ISysView | undefined;
    delViewById(id: string): void;
    createView(id: string, container: HTMLElement): ISysView;
}
