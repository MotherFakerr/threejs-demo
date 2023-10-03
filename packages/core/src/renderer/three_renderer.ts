import { BoxGeometry, Mesh, MeshBasicMaterial, Renderer, Scene, WebGLRenderer } from 'three';
import { IRenderer, IThreeRenderOptions } from './interface';
import { PerspectiveCamera } from './camera/perspective_camera';
import { EN_CAMERA_TYPE, ICamera, OrthographicCamera } from './camera';

export class ThreeRenderer implements IRenderer {
    private _scene: Scene;

    private _camera: ICamera;

    private _renderer: Renderer;

    constructor(container: HTMLElement, options: IThreeRenderOptions = {}) {
        this._scene = new Scene();
        this._initCamera(container, options);
        this._renderer = new WebGLRenderer();
        this._renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this._renderer.domElement);

        const geometry = new BoxGeometry();
        const material = new MeshBasicMaterial({ color: 0xff2288 });
        const cube = new Mesh(geometry, material);

        this._scene.add(cube);
    }

    public render(): void {
        this._renderer.render(this._scene, this._camera.getInstance());
    }

    public resize(width: number, height: number): void {
        this._renderer.setSize(width, height);
        this._camera.resize(width, height);
        this.render();
    }

    public getCamera(): ICamera {
        return this._camera;
    }

    private _initCamera(
        container: HTMLElement,
        { cameraType = EN_CAMERA_TYPE.PRESPECTIVE, fov = 75, near = 0.1, far = 1000 }: IThreeRenderOptions,
    ): void {
        if (cameraType === EN_CAMERA_TYPE.PRESPECTIVE) {
            this._camera = new PerspectiveCamera({
                fov,
                aspect: container.clientWidth / container.clientHeight,
                near,
                far,
            });
        } else {
            this._camera = new OrthographicCamera({
                left: -container.clientWidth / 2,
                right: container.clientWidth / 2,
                top: container.clientHeight / 2,
                bottom: -container.clientHeight / 2,
                near,
                far,
            });
        }
    }
}
