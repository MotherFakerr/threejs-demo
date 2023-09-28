export interface IRenderer {
    render(): void;
    resize(width: number, height: number): void;
}
