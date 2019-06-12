
export interface Zdog {
  TAU: number;
  extend(a: ZdogTypes.ZdogAnchor, b: ZdogTypes.ZdogAnchor): ZdogTypes.ZdogAnchor;
  lerp(a: ZdogTypes.ZdogVector, b: ZdogTypes.ZdogVector, alpha: number): ZdogTypes.ZdogVector;
  modulo(num: number, div: number): number;
  easeInOut(alpha: number, power: number): number;
  Anchor: new (options: ZdogTypes.ZdogAnchorOptions) => ZdogTypes.ZdogAnchor;
  Shape: new (options: ZdogTypes.ZdogShapeOptions) => ZdogTypes.ZdogShape;
  Group: new (options: ZdogTypes.ZdogGroupOptions) => ZdogTypes.ZdogGroup;
  Dragger: new (options: ZdogTypes.ZdogDraggerOptions) => ZdogTypes.ZdogDragger;
  Illustration: new (options: ZdogTypes.ZdogIllustrationOptions) => ZdogTypes.ZdogIllustration;
  Vector: new (options: ZdogTypes.ZdogVectorOptions) => ZdogTypes.ZdogVector;
  Rect: new (options: ZdogTypes.ZdogRectOptions) => ZdogTypes.ZdogRect;
  RoundedRect: new (options: ZdogTypes.ZdogRoundedRectOptions) => ZdogTypes.ZdogRoundedRect;
  Ellipse: new (options: ZdogTypes.ZdogEllipseOptions) => ZdogTypes.ZdogEllipse;
  Polygon: new (options: ZdogTypes.ZdogPolygonOptions) => ZdogTypes.ZdogPolygon;
  Hemisphere: new (options: ZdogTypes.ZdogHemisphereOptions) => ZdogTypes.ZdogHemisphere;
  Cone: new (options: ZdogTypes.ZdogConeOptions) => ZdogTypes.ZdogCone;
  Cylinder: new (options: ZdogTypes.ZdogCylinderOptions) => ZdogTypes.ZdogCylinder;
  Box: new (options: ZdogTypes.ZdogBoxOptions) => ZdogTypes.ZdogBox;
}
declare namespace ZdogTypes {
  interface ZdogVectorOptions {
  
    x?: number;
    y?: number;
    z?: number;
  }
  interface ZdogAnchorOptions {
  
    addTo?: ZdogAnchor;
    translate?: ZdogVectorOptions;
    rotate?: ZdogVectorOptions;
    scale?: ZdogVectorOptions;
  }
  interface ZdogGroupOptions extends ZdogAnchorOptions {
  
    visible?: boolean;
    updateSort?: boolean;
  }
  interface ZdogShapeOptions extends ZdogAnchorOptions {
  
    color?: string;
    stroke?: number | false;
    fill?: boolean;
    closed?: boolean;
    visible?: boolean;
    backface?: boolean | string;
    front?: ZdogVector;
    path?: (ZdogLine | ZdogMove | ZdogArc | ZdogBezier)[];
  }
  interface ZdogDraggerOptions {
  
    startElement?: string | HTMLElement;
    onDragStart?: (pointer: Event | Touch) => void;
    onDragMove?: (pointer: Event | Touch, moveX: number, moveY: number) => void;
    onDragEnd?: () => void; 
  }
  interface ZdogIllustrationOptions extends ZdogAnchorOptions, ZdogDraggerOptions {
    element?: string | HTMLCanvasElement | SVGElement;
    zoom?: number;
    centered?: boolean;
    dragRotate?: boolean;
    resize?: boolean | 'fullscreen';
    onResize?: (width?: number, height?: number) => void;
    onPrerender?: (context: CanvasRenderingContext2D | SVGElement) => void;
  }
  interface ZdogPoint {
    x?: number;
    y?: number;
    z?: number;
  }
  interface ZdogLine {
    line: ZdogPoint;
  }
  interface ZdogMove {
    move: ZdogPoint;
  }
  interface ZdogArc {
    arc: ZdogPoint[];
  }
  interface ZdogBezier {
    bezier: ZdogPoint[];
  }
  interface ZdogAnchor {
    new(options: ZdogAnchorOptions): ZdogAnchor;
    translate: ZdogVector;
    rotate: ZdogVector;
    scale: ZdogVector;
    origin: ZdogVector;
    renderOrigin: ZdogVector;
    children: ZdogAnchor[];
    addTo: ZdogAnchor;
    copy(): ZdogAnchor;
    copyGraph(): ZdogAnchor;
    addChild(shape: ZdogAnchor): void;
    removeChild(shape: ZdogAnchor): void;
    remove(): void;
    updateGraph(): void;
    renderGraphCanvas(ctx: CanvasRenderingContext2D): void;
    renderGraphSvg(svg: SVGElement): void;
    normalizeRotate(): void;
  }
  interface ZdogShape extends ZdogAnchor {
    new(options: ZdogShapeOptions): ZdogShape;
    color: string;
    stroke: number | false;
    fill: boolean;
    closed: boolean;
    visible: boolean;
    backface: boolean | string;
    front: ZdogVector;
    path: (ZdogLine | ZdogMove | ZdogArc | ZdogBezier)[];
    updatePath(): void;
  }
  interface ZdogGroup extends ZdogAnchor {
    visible: boolean;
    updateSort: boolean;
  }
  interface ZdogDragger {
    new(options: ZdogDraggerOptions): ZdogDragger;
    startElement: string | HTMLElement;
    onDragStart: (pointer: Event | Touch) => void;
    onDragMove: (pointer: Event | Touch, moveX: number, moveY: number) => void;
    onDragEnd: () => void; 
  }
  interface ZdogIllustration extends ZdogAnchor, ZdogDragger{
    new(options: ZdogIllustrationOptions): ZdogIllustration;
    element: string | HTMLCanvasElement | SVGElement;
    zoom: number;
    centered: boolean;
    dragRotate: boolean;
    resize: boolean | 'fullscreen';
    onResize: (width?: number, height?: number) => void;
    onPrerender: (context: CanvasRenderingContext2D | SVGElement) => void;
    renderGraph(scene?: ZdogAnchor): void;
    updateRenderGraph(scene?: ZdogAnchor): void;
    setSize(width: number, height: number): void;
  }
  interface ZdogVector {
  
    x: number;
    y: number;
    z: number;
    // tslint:disable-next-line: completed-docs
    set(a: ZdogVectorOptions): ZdogVector;
    copy(): ZdogVector;
    // tslint:disable-next-line: completed-docs
    add(a: ZdogVectorOptions): ZdogVector;
    // tslint:disable-next-line: completed-docs
    subtract(a: ZdogVectorOptions): ZdogVector;
    // tslint:disable-next-line: completed-docs
    multiply(a: ZdogVectorOptions): ZdogVector;
    // tslint:disable-next-line: completed-docs
    rotate(a: ZdogVectorOptions): ZdogVector;
    magnitude(): number;
    lerp(point: ZdogVector, alpha: number): ZdogVector;
  }
  interface ZdogRectOptions extends ZdogShapeOptions {
    width?: number;
    height?: number;
  }
  interface ZdogRect extends ZdogShape {
    width: number;
    height: number;
  }
  interface ZdogRoundedRect extends ZdogShape {
    width: number;
    height: number;
    cornerRadius: number;  
  }
  interface ZdogRoundedRectOptions extends ZdogShapeOptions {
    width?: number;
    height?: number;
    cornerRadius?: number;
  }
  interface ZdogEllipse extends ZdogShape {
    diameter: number;
    width: number;
    height: number;
    quarters: number;
  }
  interface ZdogEllipseOptions extends ZdogShape {
    diameter?: number;
    width?: number;
    height?: number;
    quarters?: number;
  }
  interface ZdogPolygon extends ZdogShape {
    radius: number;
    sides: number;
  }
  interface ZdogPolygonOptions extends ZdogShapeOptions {
    radius?: number;
    sides?: number;
  }
  interface ZdogHemisphere extends ZdogShape {
    diameter: number;
  }
  interface ZdogHemisphereOptions extends ZdogShapeOptions {
    diameter?: number;
  }
  interface ZdogCone extends ZdogShape {
    diameter: number;
    length: number;
  }
  interface ZdogConeOptions extends ZdogShapeOptions {
    diameter?: number;
    length?: number;
  }
  interface ZdogCylinder extends ZdogShape {
    diameter: number;
    length: number;
    frontFace: string;
  }
  interface ZdogCylinderOptions extends ZdogShapeOptions {
    diameter?: number;
    length?: number;
    frontFace?: string;
  }
  interface ZdogBox extends ZdogShape {
    width: number;
    height: number;
    depth: number;
    leftFace: string;
    rightFace: string;
    topFace: string;
    bottomFace: string;
  }
  interface ZdogBoxOptions extends ZdogShapeOptions {
    width?: number;
    height?: number;
    depth?: number;
    leftFace?: string;
    rightFace?: string;
    topFace?: string;
    bottomFace?: string;
  }
}