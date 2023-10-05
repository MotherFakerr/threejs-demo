import {
    AxesHelper,
    BoxGeometry,
    Color,
    Mesh,
    MeshBasicMaterial,
    MeshLambertMaterial,
    PointLight,
    PointLightHelper,
    Renderer,
    Scene,
    Vector3,
    WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { IRenderer, IThreeRenderOptions } from './interface';
import { PerspectiveCamera } from './camera/perspective_camera';
import { EN_CAMERA_TYPE, ICamera, OrthographicCamera } from './camera';

export class ThreeRenderer implements IRenderer {
    private _scene: Scene;

    private _camera: ICamera;

    private _renderer: Renderer;

    constructor(container: HTMLElement, options: IThreeRenderOptions) {
        this._scene = new Scene();
        this._initCamera(container, options);
        this._initRenderer(container);

        // temp code -------------
        const geometry = new BoxGeometry(50, 100, 20);
        const material = new MeshBasicMaterial({
            color: 0xff2288,
            transparent: true, // 开启透明
            opacity: 0.5,
        });

        const material1 = new MeshLambertMaterial({
            color: 0xff2288,
            transparent: true, // 开启透明
            opacity: 0.5,
        });
        const cube = new Mesh(geometry, material);
        cube.position.set(0, 0, 0);
        const cube1 = new Mesh(geometry, material1);
        cube1.position.set(120, 0, 0);

        const pointLight = new PointLight(0xffffff, 1, 0, 0);
        pointLight.position.set(80, 200, 0);

        this._scene.add(cube, cube1, pointLight);
        // this._scene.background = new Color(255, 255, 255);

        // tmp code end ------------------

        const { isDebug } = options;
        if (isDebug) {
            const axesHelper = new AxesHelper(150);
            const pointLightHelper = new PointLightHelper(pointLight, 10);
            this._scene.add(axesHelper, pointLightHelper);

            const controls = new OrbitControls(this._camera.getInstance(), container);
            // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
            controls.addEventListener('change', () => {
                this._renderer.render(this._scene, this._camera.getInstance()); // 执行渲染操作
            });
        }
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

    public getScene(): Scene {
        return this._scene;
    }

    private _initCamera(
        container: HTMLElement,
        { cameraType = EN_CAMERA_TYPE.PRESPECTIVE, perspectiveCameraOptions, orthographicCameraOptions }: IThreeRenderOptions,
    ): void {
        if (cameraType === EN_CAMERA_TYPE.PRESPECTIVE) {
            const options = perspectiveCameraOptions ?? {
                fov: 75,
                aspect: container.clientWidth / container.clientHeight,
                near: 0.1,
                far: 1000,
            };

            this._camera = new PerspectiveCamera(options);
        } else {
            const options = orthographicCameraOptions ?? {
                left: -container.clientWidth / 2,
                right: container.clientWidth / 2,
                top: container.clientHeight / 2,
                bottom: -container.clientHeight / 2,
                near: 0.1,
                far: 1000,
            };
            this._camera = new OrthographicCamera(options);
        }

        this._camera.position.set(0, 0, 200);
        this._camera.lookAt(0, 0, 0);
    }

    private _initRenderer(container: HTMLElement): void {
        this._renderer = new WebGLRenderer();
        this._renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this._renderer.domElement);
    }
}
