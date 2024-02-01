/* eslint-disable @typescript-eslint/naming-convention */
import * as THREE from 'three';
import { MathUtils, Plane, Ray } from 'three';
import { Vector2, Vector3 } from '@threejs-demo/math';
import { AbstractCamera } from './abstract_camera';
import { OrthographicCamera } from './orthographic_camera';
import { PerspectiveCamera } from './perspective_camera';

// OrbitControls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
//
//    Orbit - left mouse / touch: one-finger move
//    Zoom - middle mouse, or mousewheel / touch: two-finger spread or squish
//    Pan - right mouse, or left mouse + ctrl/meta/shiftKey, or arrow keys / touch: two-finger move

interface IUpdateParams {
    offset: Vector3;
    quat: THREE.Quaternion;
    quatInverse: THREE.Quaternion;
    lastPosition: Vector3;
    lastQuaternion: THREE.Quaternion;
    lastTargetPosition: Vector3;
}

enum EN_STATE {
    NONE = -1,
    ROTATE = 0,
    DOLLY = 1,
    PAN = 2,
    TOUCH_ROTATE = 3,
    TOUCH_PAN = 4,
    TOUCH_DOLLY_PAN = 5,
    TOUCH_DOLLY_ROTATE = 6,
}

const _changeEvent = { type: 'change' };
const _startEvent = { type: 'start' };
const _endEvent = { type: 'end' };
const _ray = new Ray();
const _plane = new Plane();
const TILT_LIMIT = Math.cos(70 * MathUtils.DEG2RAD);

class OrbitControls {
    /**
     * The camera being controlled.
     */
    object: AbstractCamera;

    /**
     * The HTMLElement used to listen for mouse / touch events.
     * This must be passed in the constructor;
     * changing it here will not set up new event listeners.
     */
    domElement: HTMLElement;

    /**
     * When set to `false`, the controls will not respond to user input.
     * @default true
     */
    enabled: boolean;

    /**
     * The focus point of the controls, the .object orbits around this.
     * It can be updated manually at any point to change the focus
     * of the controls.
     */
    target: Vector3;

    /** @deprecated */
    center: Vector3;

    /**
     * How far you can dolly in ( PerspectiveCamera only ).
     * @default 0
     */
    minDistance: number;

    /**
     * How far you can dolly out ( PerspectiveCamera only ).
     * @default Infinity
     */
    maxDistance: number;

    /**
     * How far you can zoom in ( OrthographicCamera only ).
     * @default 0
     */
    minZoom: number;

    /**
     * How far you can zoom out ( OrthographicCamera only ).
     * @default Infinity
     */
    maxZoom: number;

    /**
     * How far you can orbit vertically, lower limit.
     * Range is 0 to Math.PI radians.
     * @default 0
     */
    minPolarAngle: number;

    /**
     * How far you can orbit vertically, upper limit.
     * Range is 0 to Math.PI radians.
     * @default Math.PI.
     */
    maxPolarAngle: number;

    /**
     * How far you can orbit horizontally, lower limit.
     * If set, the interval [ min, max ]
     * must be a sub-interval of [ - 2 PI, 2 PI ],
     * with ( max - min < 2 PI ).
     * @default Infinity
     */
    minAzimuthAngle: number;

    /**
     * How far you can orbit horizontally, upper limit.
     * If set, the interval [ min, max ] must be a sub-interval
     * of [ - 2 PI, 2 PI ], with ( max - min < 2 PI ).
     * @default Infinity
     */
    maxAzimuthAngle: number;

    /**
     * Set to true to enable damping (inertia), which can
     * be used to give a sense of weight to the controls.
     * Note that if this is enabled, you must call
     * .update () in your animation loop.
     * @default false
     */
    enableDamping: boolean;

    /**
     * The damping inertia used if .enableDamping is set to true.
     * Note that for this to work,
     * you must call .update () in your animation loop.
     * @default 0.05
     */
    dampingFactor: number;

    /**
     * Enable or disable zooming (dollying) of the camera.
     * @default true
     */
    enableZoom: boolean;

    /**
     * Speed of zooming / dollying.
     * @default 1
     */
    zoomSpeed: number;

    /**
     * Setting this property to `true` allows to zoom to the cursor's position.
     * @default false
     */
    zoomToCursor: boolean;

    /**
     * Enable or disable horizontal and
     * vertical rotation of the camera.
     * Note that it is possible to disable a single axis
     * by setting the min and max of the polar angle or
     * azimuth angle to the same value, which will cause
     * the vertical or horizontal rotation to be fixed at that value.
     * @default true
     */
    enableRotate: boolean;

    /**
     * Speed of rotation.
     * @default 1
     */
    rotateSpeed: number;

    /**
     * Enable or disable camera panning.
     * @default true
     */
    enablePan: boolean;

    /**
     * Speed of panning.
     * @default 1
     */
    panSpeed: number;

    /**
     * Defines how the camera's position is translated when panning.
     * If true, the camera pans in screen space. Otherwise,
     * the camera pans in the plane orthogonal to the camera's
     * up direction. Default is true for OrbitControls; false for MapControls.
     * @default true
     */
    screenSpacePanning: boolean;

    /**
     * How fast to pan the camera when the keyboard is used.
     * Default is 7.0 pixels per keypress.
     * @default 7
     */
    keyPanSpeed: number;

    /**
     * Set to true to automatically rotate around the target.
     * Note that if this is enabled, you must call .update() in your animation loop. If you want the auto-rotate speed
     * to be independent of the frame rate (the refresh rate of the display), you must pass the time `deltaTime`, in
     * seconds, to .update().
     */
    autoRotate: boolean;

    /**
     * How fast to rotate around the target if .autoRotate is true.
     * Default is 2.0, which equates to 30 seconds per orbit at 60fps.
     * Note that if .autoRotate is enabled, you must call
     * .update () in your animation loop.
     * @default 2
     */
    autoRotateSpeed: number;

    /**
     * This object contains references to the keycodes for controlling
     * camera panning. Default is the 4 arrow keys.
     */
    keys: { LEFT: string; UP: string; RIGHT: string; BOTTOM: string };

    /**
     * This object contains references to the mouse actions used
     * by the controls.
     */
    mouseButtons: {
        LEFT?: THREE.MOUSE | null | undefined;
        MIDDLE?: THREE.MOUSE | null | undefined;
        RIGHT?: THREE.MOUSE | null | undefined;
    };

    /**
     * This object contains references to the touch actions used by
     * the controls.
     */
    touches: { ONE?: THREE.TOUCH | null | undefined; TWO?: THREE.TOUCH | null | undefined };

    /**
     * Used internally by the .saveState and .reset methods.
     */
    target0: Vector3;

    /**
     * Used internally by the .saveState and .reset methods.
     */
    position0: Vector3;

    /**
     * Used internally by the .saveState and .reset methods.
     */
    zoom0?: number;

    cursor: Vector3;

    minTargetRadius: number;

    maxTargetRadius: number;

    _scope: this;

    _EPS = 0.000001;

    _spherical = new THREE.Spherical();

    _sphericalDelta = new THREE.Spherical();

    _scale = 1;

    _panOffset = new Vector3();

    _rotateStart = new Vector2();

    _rotateEnd = new Vector2();

    _rotateDelta = new Vector2();

    _panStart = new Vector2();

    _panEnd = new Vector2();

    _panDelta = new Vector2();

    _dollyStart = new Vector2();

    _dollyEnd = new Vector2();

    _dollyDelta = new Vector2();

    _dollyDirection = new Vector3();

    _mouse = new Vector2();

    _performCursorZoom = false;

    _pointers = [];

    _pointerPositions = {};

    _controlActive = false;

    _updateParams: IUpdateParams;

    _panLeftV = new Vector3();

    _panUpV = new Vector3();

    _panHelperOffset = new Vector3();

    _state = EN_STATE.NONE;

    constructor(object: AbstractCamera, domElement: HTMLElement) {
        this.object = object;
        this.domElement = domElement;
        this.domElement.style.touchAction = 'none'; // disable touch scroll

        // Set to false to disable this control
        this.enabled = true;

        // "target" sets the location of focus, where the object orbits around
        this.target = new Vector3();

        // Sets the 3D cursor (similar to Blender), from which the maxTargetRadius takes effect
        this.cursor = new Vector3();

        // How far you can dolly in and out ( PerspectiveCamera only )
        this.minDistance = 0;
        this.maxDistance = Infinity;

        // How far you can zoom in and out ( OrthographicCamera only )
        this.minZoom = 0;
        this.maxZoom = Infinity;

        // Limit camera target within a spherical area around the cursor
        this.minTargetRadius = 0;
        this.maxTargetRadius = Infinity;

        // How far you can orbit vertically, upper and lower limits.
        // Range is 0 to Math.PI radians.
        this.minPolarAngle = 0; // radians
        this.maxPolarAngle = Math.PI; // radians

        // How far you can orbit horizontally, upper and lower limits.
        // If set, the interval [ min, max ] must be a sub-interval of [ - 2 PI, 2 PI ], with ( max - min < 2 PI )
        this.minAzimuthAngle = -Infinity; // radians
        this.maxAzimuthAngle = Infinity; // radians

        // Set to true to enable damping (inertia)
        // If damping is enabled, you must call controls.update() in your animation loop
        this.enableDamping = false;
        this.dampingFactor = 0.05;

        // This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
        // Set to false to disable zooming
        this.enableZoom = true;
        this.zoomSpeed = 1.0;

        // Set to false to disable rotating
        this.enableRotate = true;
        this.rotateSpeed = 1.0;

        // Set to false to disable panning
        this.enablePan = true;
        this.panSpeed = 1.0;
        this.screenSpacePanning = true; // if false, pan orthogonal to world-space direction camera.up
        this.keyPanSpeed = 7.0; // pixels moved per arrow key push
        this.zoomToCursor = false;

        // Set to true to automatically rotate around the target
        // If auto-rotate is enabled, you must call controls.update() in your animation loop
        this.autoRotate = false;
        this.autoRotateSpeed = 2.0; // 30 seconds per orbit when fps is 60

        // The four arrow keys
        this.keys = { LEFT: 'ArrowLeft', UP: 'ArrowUp', RIGHT: 'ArrowRight', BOTTOM: 'ArrowDown' };

        // Mouse buttons
        this.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };

        // Touch fingers
        this.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };

        // for reset
        this.target0 = this.target.clone();
        this.position0 = this.object.position.clone();
        this.zoom0 = this.object instanceof OrthographicCamera ? this.object.getInstance().zoom : undefined;

        this._resetUpdate();
    }

    public getPolarAngle(): number {
        return this._spherical.phi;
    }

    public getAzimuthalAngle(): number {
        return this._spherical.theta;
    }

    public getDistance(): number {
        return this.object.position.distanceTo(this.target);
    }

    public saveState(): void {
        this._scope.target0.copy(this._scope.target);
        this._scope.position0.copy(this._scope.object.position);
        this._scope.zoom0 = this._scope.object instanceof OrthographicCamera ? this._scope.object.getInstance().zoom : undefined;
    }

    public reset(): void {
        this._scope.target.copy(this._scope.target0);
        this._scope.object.position.copy(this._scope.position0);
        if (this._scope.object instanceof OrthographicCamera) {
            this._scope.object.getInstance().zoom = this._scope.zoom0 ?? 1;
        }
        this._scope.object.updateProjectionMatrix();

        this._resetUpdate();

        this._state = EN_STATE.NONE;
    }

    public update(deltaTime: number | null): boolean {
        const twoPI = 2 * Math.PI;
        const { position } = this._scope.object;

        this._updateParams.offset.copy(position).sub(this._scope.target);

        // rotate offset to "y-axis-is-up" space
        this._updateParams.offset.applyQuaternion(this._updateParams.quat);

        // angle from z-axis around y-axis
        this._spherical.setFromVector3(this._updateParams.offset);

        if (this._scope.autoRotate && this._state === EN_STATE.NONE) {
            this._rotateLeft(this._getAutoRotationAngle(deltaTime));
        }

        if (this._scope.enableDamping) {
            this._spherical.theta += this._sphericalDelta.theta * this._scope.dampingFactor;
            this._spherical.phi += this._sphericalDelta.phi * this._scope.dampingFactor;
        } else {
            this._spherical.theta += this._sphericalDelta.theta;
            this._spherical.phi += this._sphericalDelta.phi;
        }

        // restrict theta to be between desired limits

        let min = this._scope.minAzimuthAngle;
        let max = this._scope.maxAzimuthAngle;

        if (Number.isFinite(min) && Number.isFinite(max)) {
            if (min < -Math.PI) min += twoPI;
            else if (min > Math.PI) min -= twoPI;

            if (max < -Math.PI) max += twoPI;
            else if (max > Math.PI) max -= twoPI;

            if (min <= max) {
                this._spherical.theta = Math.max(min, Math.min(max, this._spherical.theta));
            } else {
                this._spherical.theta =
                    this._spherical.theta > (min + max) / 2 ? Math.max(min, this._spherical.theta) : Math.min(max, this._spherical.theta);
            }
        }

        // restrict phi to be between desired limits
        this._spherical.phi = Math.max(this._scope.minPolarAngle, Math.min(this._scope.maxPolarAngle, this._spherical.phi));

        this._spherical.makeSafe();

        // move target to panned location

        if (this._scope.enableDamping === true) {
            this._scope.target.addScaledVector(this._panOffset, this._scope.dampingFactor);
        } else {
            this._scope.target.add(this._panOffset);
        }

        // Limit the target distance from the cursor to create a sphere around the center of interest
        this._scope.target.sub(this._scope.cursor);
        this._scope.target.clampLength(this._scope.minTargetRadius, this._scope.maxTargetRadius);
        this._scope.target.add(this._scope.cursor);

        // adjust the camera position based on zoom only if we're not zooming to the cursor or if it's an ortho camera
        // we adjust zoom later in these cases
        if ((this._scope.zoomToCursor && this._performCursorZoom) || this._scope.object instanceof OrthographicCamera) {
            this._spherical.radius = this._clampDistance(this._spherical.radius);
        } else {
            this._spherical.radius = this._clampDistance(this._spherical.radius * this._scale);
        }

        this._updateParams.offset.setFromSpherical(this._spherical);

        // rotate offset back to "camera-up-vector-is-up" space
        this._updateParams.offset.applyQuaternion(this._updateParams.quatInverse);

        position.copy(this._scope.target).add(this._updateParams.offset);

        this._scope.object.getInstance().lookAt(this._scope.target);

        if (this._scope.enableDamping === true) {
            this._sphericalDelta.theta *= 1 - this._scope.dampingFactor;
            this._sphericalDelta.phi *= 1 - this._scope.dampingFactor;

            this._panOffset.multiplyScalar(1 - this._scope.dampingFactor);
        } else {
            this._sphericalDelta.set(0, 0, 0);

            this._panOffset.set(0, 0, 0);
        }

        // adjust camera position
        let zoomChanged = false;
        if (this._scope.zoomToCursor && this._performCursorZoom) {
            let newRadius = null;
            if (this._scope.object instanceof PerspectiveCamera) {
                // move the camera down the pointer ray
                // this method avoids floating point error
                const prevRadius = this._updateParams.offset.length();
                newRadius = this._clampDistance(prevRadius * this._scale);

                const radiusDelta = prevRadius - newRadius;
                this._scope.object.position.addScaledVector(this._dollyDirection, radiusDelta);
                this._scope.object.getInstance().updateMatrixWorld();
            } else if (this._scope.object instanceof OrthographicCamera) {
                // adjust the ortho camera position based on zoom changes
                const mouseBefore = new Vector3(this._mouse.x, this._mouse.y, 0);
                mouseBefore.unproject(this._scope.object.getInstance());

                this._scope.object.getInstance().zoom = Math.max(
                    this._scope.minZoom,
                    Math.min(this._scope.maxZoom, this._scope.object.getInstance().zoom / this._scale),
                );
                this._scope.object.updateProjectionMatrix();
                zoomChanged = true;

                const mouseAfter = new Vector3(this._mouse.x, this._mouse.y, 0);
                mouseAfter.unproject(this._scope.object.getInstance());

                this._scope.object.position.sub(mouseAfter).add(mouseBefore);
                this._scope.object.getInstance().updateMatrixWorld();

                newRadius = this._updateParams.offset.length();
            } else {
                console.warn('WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled.');
                this._scope.zoomToCursor = false;
            }

            // handle the placement of the target
            if (newRadius !== null) {
                if (this.screenSpacePanning) {
                    // position the orbit target in front of the new camera position
                    this._scope.target
                        .set(0, 0, -1)
                        .transformDirection(this._scope.object.getInstance().matrix)
                        .multiplyScalar(newRadius)
                        .add(this._scope.object.position);
                } else {
                    // get the ray and translation plane to compute target
                    _ray.origin.copy(this._scope.object.position);
                    _ray.direction.set(0, 0, -1).transformDirection(this._scope.object.getInstance().matrix);

                    // if the camera is 20 degrees above the horizon then don't adjust the focus target to avoid
                    // extremely large values
                    if (Math.abs(this._scope.object.getInstance().up.dot(_ray.direction)) < TILT_LIMIT) {
                        this.object.getInstance().lookAt(this._scope.target);
                    } else {
                        _plane.setFromNormalAndCoplanarPoint(this._scope.object.getInstance().up, this._scope.target);
                        _ray.intersectPlane(_plane, this._scope.target);
                    }
                }
            }
        } else if (this._scope.object instanceof OrthographicCamera) {
            zoomChanged = this._scale !== 1;

            if (zoomChanged) {
                this._scope.object.getInstance().zoom = Math.max(
                    this._scope.minZoom,
                    Math.min(this._scope.maxZoom, this._scope.object.getInstance().zoom / this._scale),
                );
                this._scope.object.updateProjectionMatrix();
            }
        }

        this._scale = 1;
        this._performCursorZoom = false;

        // update condition is:
        // min(camera displacement, camera rotation in radians)^2 > EPS
        // using small-angle approximation cos(x/2) = 1 - x^2 / 8

        if (
            zoomChanged ||
            this._updateParams.lastPosition.distanceToSquared(this._scope.object.position) > this._EPS ||
            8 * (1 - this._updateParams.lastQuaternion.dot(this._scope.object.getInstance().quaternion)) > this._EPS ||
            this._updateParams.lastTargetPosition.distanceToSquared(this._scope.target) > 0
        ) {
            this._updateParams.lastPosition.copy(this._scope.object.position);
            this._updateParams.lastQuaternion.copy(this._scope.object.getInstance().quaternion);
            this._updateParams.lastTargetPosition.copy(this._scope.target);

            return true;
        }

        return false;
    }

    private _resetUpdate(): void {
        this._updateParams.offset = new Vector3();
        this._updateParams.quat = new THREE.Quaternion().setFromUnitVectors(this.object.getInstance().up, new Vector3(0, 1, 0));
        this._updateParams.quatInverse = this._updateParams.quat.clone().invert();
        this._updateParams.lastPosition = new Vector3();
        this._updateParams.lastQuaternion = new THREE.Quaternion();
        this._updateParams.lastTargetPosition = new Vector3();
    }

    private _getAutoRotationAngle(deltaTime: number | null): number {
        if (deltaTime !== null) {
            return ((2 * Math.PI) / 60) * this._scope.autoRotateSpeed * deltaTime;
        }
        return ((2 * Math.PI) / 60 / 60) * this._scope.autoRotateSpeed;
    }

    private _getZoomScale(delta: number): number {
        const normalizedDelta = Math.abs(delta * 0.01);
        return 0.95 ** this._scope.zoomSpeed * normalizedDelta;
    }

    private _rotateLeft(angle: number): void {
        this._sphericalDelta.theta -= angle;
    }

    private _rotateUp(angle: number): void {
        this._sphericalDelta.phi -= angle;
    }

    private _panLeft(distance: number, objectMatrix: THREE.Matrix4): void {
        this._panLeftV.setFromMatrixColumn(objectMatrix, 0); // get X column of objectMatrix
        this._panLeftV.multiplyScalar(-distance);
        this._panOffset.add(this._panLeftV);
    }

    private _panUp(distance: number, objectMatrix: THREE.Matrix4): void {
        if (this._scope.screenSpacePanning === true) {
            this._panUpV.setFromMatrixColumn(objectMatrix, 1);
        } else {
            this._panUpV.setFromMatrixColumn(objectMatrix, 0);
            this._panUpV.crossVectors(this._scope.object.getInstance().up, this._panUpV);
        }
        this._panUpV.multiplyScalar(distance);
        this._panOffset.add(this._panUpV);
    }

    private _pan(deltaX: number, deltaY: number) {
        const element = this._scope.domElement;

        if (this._scope.object instanceof PerspectiveCamera) {
            // perspective
            const { position } = this._scope.object;
            this._panHelperOffset.copy(position).sub(this._scope.target);
            let targetDistance = this._panHelperOffset.length();

            // half of the fov is center to top of screen
            targetDistance *= Math.tan(((this._scope.object.fov / 2) * Math.PI) / 180.0);

            // we use only clientHeight here so aspect ratio does not distort speed
            this._panLeft((2 * deltaX * targetDistance) / element.clientHeight, this._scope.object.getInstance().matrix);
            this._panUp((2 * deltaY * targetDistance) / element.clientHeight, this._scope.object.getInstance().matrix);
        } else if (this._scope.object instanceof OrthographicCamera) {
            // orthographic
            this._panLeft(
                (deltaX * (this._scope.object.getInstance().right - this._scope.object.getInstance().left)) /
                    this._scope.object.getInstance().zoom /
                    element.clientWidth,
                this._scope.object.getInstance().matrix,
            );
            this._panUp(
                (deltaY * (this._scope.object.getInstance().top - this._scope.object.getInstance().bottom)) /
                    this._scope.object.getInstance().zoom /
                    element.clientHeight,
                this._scope.object.getInstance().matrix,
            );
        } else {
            // camera neither orthographic nor perspective
            console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.');
            this._scope.enablePan = false;
        }
    }

    private _dollyOut(dollyScale: number): void {
        if (this._scope.object instanceof PerspectiveCamera || this._scope.object instanceof OrthographicCamera) {
            this._scale /= dollyScale;
        } else {
            console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
            this._scope.enableZoom = false;
        }
    }

    private _dollyIn(dollyScale: number) {
        if (this._scope.object instanceof PerspectiveCamera || this._scope.object instanceof OrthographicCamera) {
            this._scale *= dollyScale;
        } else {
            console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
            this._scope.enableZoom = false;
        }
    }

    private _updateZoomParameters(x: number, y: number): void {
        if (!this._scope.zoomToCursor) {
            return;
        }

        this._performCursorZoom = true;

        const rect = this._scope.domElement.getBoundingClientRect();
        const dx = x - rect.left;
        const dy = y - rect.top;
        const w = rect.width;
        const h = rect.height;

        this._mouse.x = (dx / w) * 2 - 1;
        this._mouse.y = -(dy / h) * 2 + 1;

        this._dollyDirection
            .set(this._mouse.x, this._mouse.y, 1)
            .unproject(this._scope.object.getInstance())
            .sub(this._scope.object.position)
            .normalize();
    }

    private _clampDistance(dist: number): number {
        return Math.max(this._scope.minDistance, Math.min(this._scope.maxDistance, dist));
    }
}

export { OrbitControls };
