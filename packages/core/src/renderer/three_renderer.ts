import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { IRenderer, IThreeRenderOptions } from './interface';
import { PerspectiveCamera } from './camera/perspective_camera';
import { EN_CAMERA_TYPE, ICamera, OrthographicCamera } from './camera';
import { GeoElementMgr } from './geo_element_mgr';
import { AbstractGeoElement, IAbstractGeoElementInit } from '../geo_element/abstract_geo_element';
import { GElementClass } from '../geo_element/interface';
import { ElementIdPool } from '../id/id_pool';
import { ElementId } from '../id/element_id';
import QB from '@threejs-demo/assets/images/qb.png';
// import nx from './环境贴图1/nx.jpg'
import nx from '@threejs-demo/assets/images/qb.jpg';

export class ThreeRenderer implements IRenderer {
    private readonly _geoElementMgr: GeoElementMgr;

    private readonly _idPool = new ElementIdPool();

    private _scene: THREE.Scene;

    private _camera: ICamera;

    private _renderer: THREE.Renderer;

    private _stats: Stats | undefined;

    private _animationMixer: THREE.AnimationMixer;

    private _clock: THREE.Clock;

    constructor(private _container: HTMLElement, private _options: IThreeRenderOptions) {
        this._geoElementMgr = new GeoElementMgr();
        this._scene = new THREE.Scene();
        this._clock = new THREE.Clock();
        this._initCamera();
        this._initRenderer();
        this._initFrameStats();
        this._initAnimationFrame();
        this._initDebugHelper();
        this._playground();
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

    public getScene(): THREE.Scene {
        return this._scene;
    }

    public createGeoElement<T extends AbstractGeoElement>(
        Ctor: GElementClass<T>,
        params: Omit<Parameters<T['create']>[0], keyof IAbstractGeoElementInit>,
    ): T {
        const element = new Ctor(this as IRenderer, this._idPool).create({ ...params });
        this._geoElementMgr.addElements(element);
        this._scene.add(element.renderObject);
        return element;
    }

    public getElementById(eleId: number | ElementId): AbstractGeoElement | undefined {
        const id = eleId instanceof ElementId ? eleId.toNum() : eleId;
        return this._geoElementMgr.getElementById(id);
    }

    public getElementsByIds(...eleIds: (number | ElementId)[]): AbstractGeoElement[] {
        const ids = eleIds.map((id) => (id instanceof ElementId ? id.toNum() : id));
        return this._geoElementMgr.getElementsByIds(...ids);
    }

    public delElementsByIds(...eleIds: (number | ElementId)[]): void {
        const ids = eleIds.map((id) => (id instanceof ElementId ? id.toNum() : id));
        const elements = this._geoElementMgr.getElementsByIds(...ids);
        this._scene.remove(
            ...elements.reduce((allEles, ele) => {
                allEles.push(ele.renderObject);
                return allEles;
            }, [] as THREE.Object3D[]),
        );
        this._geoElementMgr.delElementsByIds(...ids);
        this._idPool.recycleIds(...ids);
    }

    public getAllElements(): AbstractGeoElement[] {
        return this._geoElementMgr.getAllElements();
    }

    public async onGeoElementUpdate(element: AbstractGeoElement): Promise<void> {
        const obj = element.renderObject.clone();
        this._scene.remove(element.renderObject);
        this._scene.add(obj);
    }

    private _requestAnimationFrame(): void {
        if (this._stats) {
            this._stats.update();
        }

        if (this._animationMixer) {
            this._animationMixer.update(this._clock.getDelta());
        }
        this.render();
        requestAnimationFrame(this._requestAnimationFrame.bind(this));
    }

    private _initCamera(): void {
        const { cameraType = EN_CAMERA_TYPE.PRESPECTIVE, perspectiveCameraOptions, orthographicCameraOptions } = this._options;
        if (cameraType === EN_CAMERA_TYPE.PRESPECTIVE) {
            const options = perspectiveCameraOptions ?? {
                fov: 75,
                aspect: this._container.clientWidth / this._container.clientHeight,
                near: 0.1,
                far: 1000,
            };

            this._camera = new PerspectiveCamera(options);
        } else {
            const options = orthographicCameraOptions ?? {
                left: -this._container.clientWidth / 2,
                right: this._container.clientWidth / 2,
                top: this._container.clientHeight / 2,
                bottom: -this._container.clientHeight / 2,
                near: 0.1,
                far: 1000,
            };
            this._camera = new OrthographicCamera(options);
        }

        this._camera.position.set(100, 100, 100);
        this._camera.lookAt(0, 0, 0);
    }

    private _initRenderer(): void {
        this._renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this._renderer.setSize(this._container.clientWidth, this._container.clientHeight);
        this._container.appendChild(this._renderer.domElement);
    }

    private _initFrameStats(): void {
        const { showFrameStats } = this._options;
        if (showFrameStats) {
            this._stats = new Stats();
            this._container.appendChild(this._stats.dom);
        }
    }

    private _initAnimationFrame(): void {
        const { isAnimate } = this._options;
        if (isAnimate) {
            this._requestAnimationFrame();
        }
    }

    private _initDebugHelper(): void {
        const { isDebug } = this._options;
        if (isDebug) {
            const axesHelper = new THREE.AxesHelper(150);
            this._scene.add(axesHelper);

            // TODO: 后期自己写
            const controls = new OrbitControls(this._camera.getInstance(), this._container);
            console.log(controls);
        }
    }

    private _playground(): void {
        const box = new THREE.BoxGeometry(50, 100, 20);
        const material = new THREE.MeshLambertMaterial({
            color: 0x00ffff,
            transparent: true, // 开启透明
            opacity: 0.5,
        });

        const cube = new THREE.Mesh(box, material);
        cube.position.set(0, 0, 0);
        const cube1 = new THREE.Mesh(box, material);
        cube1.position.set(120, 0, 0);

        this._scene.background = null;
        // this._scene.add(cube);

        const width = 100;
        const length = 100;
        const vertices = new Float32Array([length, 0, width, length, 0, -width, -length, 0, -width, -length, 0, width]);
        const index = new Uint16Array([0, 1, 2, 0, 2, 3]);
        const geometry = new THREE.BufferGeometry();
        const verticeAttributes = new THREE.BufferAttribute(vertices, 3);
        const indexAttributes = new THREE.BufferAttribute(index, 1);
        geometry.attributes.position = verticeAttributes;
        geometry.index = indexAttributes;

        const planeGeometry = new THREE.PlaneGeometry(100, 100, 10, 10);
        const texLoader = new THREE.TextureLoader();
        // .load()方法加载图像，返回一个纹理对象Texture
        const texture = texLoader.load(QB);

        const floorMaterial = new THREE.MeshLambertMaterial({
            // color: 0x0000ff,
            // // transparent: true, // 开启透明
            // // opacity: 1,
            // side: THREE.DoubleSide,
            // wireframe: true,
            // map: texture,
        });

        const floor = new THREE.Mesh(planeGeometry, floorMaterial);
        floor.rotateX(-Math.PI / 2);
        this._scene.add(floor);

        const loader = new GLTFLoader();
        loader.load('model/keli.gltf', (mmd) => {
            // called when the resource is loaded
            const model = mmd.scene;
            this._animationMixer = new THREE.AnimationMixer(model);
            const clip = this._animationMixer.clipAction(mmd.animations[0]);
            this._scene.add(model);

            clip.play();
        });

        const loader1 = new FBXLoader();
        loader1.load('大社.fbx', (mmd) => {
            mmd.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    child.material = new THREE.MeshLambertMaterial({
                        color: 0x004444,
                        transparent: true,
                        opacity: 0.5,
                    });
                    // 模型边线设置
                    const edges = new THREE.EdgesGeometry(child.geometry);
                    const edgesMaterial = new THREE.LineBasicMaterial({
                        color: 0x00ffff,
                    });
                    const line = new THREE.LineSegments(edges, edgesMaterial);
                    child.add(line);
                }
            });
            this._scene.add(mmd);
        });
    }
}
