export interface Zdog {
  TAU: number;
  extend(a: Zdog.Anchor, b: Zdog.Anchor): Zdog.Anchor;
  lerp(a: Zdog.Vector, b: Zdog.Vector, alpha: number): Zdog.Vector;
  lerp(a: number, b: number, alpha: number): number;
  modulo(num: number, div: number): number;
  easeInOut(alpha: number, power: number): number;
  Anchor: new (options: Zdog.AnchorOptions) => Zdog.Anchor;
  Shape: new (options: Zdog.ShapeOptions) => Zdog.Shape;
  Group: new (options: Zdog.GroupOptions) => Zdog.Group;
  Dragger: new (options: Zdog.DraggerOptions) => Zdog.Dragger;
  Illustration: new (options: Zdog.IllustrationOptions) => Zdog.Illustration;
  Vector: new (options: Zdog.VectorOptions) => Zdog.Vector;
  Rect: new (options: Zdog.RectOptions) => Zdog.Rect;
  RoundedRect: new (options: Zdog.RoundedRectOptions) => Zdog.RoundedRect;
  Ellipse: new (options: Zdog.EllipseOptions) => Zdog.Ellipse;
  Polygon: new (options: Zdog.PolygonOptions) => Zdog.Polygon;
  Hemisphere: new (options: Zdog.HemisphereOptions) => Zdog.Hemisphere;
  Cone: new (options: Zdog.ConeOptions) => Zdog.Cone;
  Cylinder: new (options: Zdog.CylinderOptions) => Zdog.Cylinder;
  Box: new (options: Zdog.BoxOptions) => Zdog.Box;
}
declare namespace Zdog {
  interface VectorOptions {
  
    x?: number;
    y?: number;
    z?: number;
  }
  interface AnchorOptions {
  
    addTo?: Anchor;
    translate?: VectorOptions;
    rotate?: VectorOptions;
    scale?: VectorOptions;
  }
  interface GroupOptions extends AnchorOptions {
  
    visible?: boolean;
    updateSort?: boolean;
  }
  interface ShapeOptions extends AnchorOptions {
  
    color?: string;
    stroke?: number | false;
    fill?: boolean;
    closed?: boolean;
    visible?: boolean;
    backface?: boolean | string;
    front?: Vector;
    path?: (Line | Move | Arc | Bezier)[];
  }
  interface DraggerOptions {
  
    startElement?: string | HTMLElement;
    onDragStart?: (pointer: Event | Touch) => void;
    onDragMove?: (pointer: Event | Touch, moveX: number, moveY: number) => void;
    onDragEnd?: () => void; 
  }
  interface IllustrationOptions extends AnchorOptions, DraggerOptions {
    element?: string | HTMLCanvasElement | SVGElement;
    zoom?: number;
    centered?: boolean;
    dragRotate?: boolean;
    resize?: boolean | 'fullscreen';
    onResize?: (width?: number, height?: number) => void;
    onPrerender?: (context: CanvasRenderingContext2D | SVGElement) => void;
  }
  interface Point {
    x?: number;
    y?: number;
    z?: number;
  }
  interface Line {
    line: Point;
  }
  interface Move {
    move: Point;
  }
  interface Arc {
    arc: Point[];
  }
  interface Bezier {
    bezier: Point[];
  }
  interface Anchor {
    new(options: AnchorOptions): Anchor;
    translate: Vector;
    rotate: Vector;
    scale: Vector;
    origin: Vector;
    renderOrigin: Vector;
    children: Anchor[];
    addTo: Anchor;
    copy(): Anchor;
    copyGraph(): Anchor;
    addChild(shape: Anchor): void;
    removeChild(shape: Anchor): void;
    remove(): void;
    updateGraph(): void;
    renderGraphCanvas(ctx: CanvasRenderingContext2D): void;
    renderGraphSvg(svg: SVGElement): void;
    normalizeRotate(): void;
  }
  interface Shape extends Anchor {
    new(options: ShapeOptions): Shape;
    color: string;
    stroke: number | false;
    fill: boolean;
    closed: boolean;
    visible: boolean;
    backface: boolean | string;
    front: Vector;
    path: (Line | Move | Arc | Bezier)[];
    updatePath(): void;
  }
  interface Group extends Anchor {
    visible: boolean;
    updateSort: boolean;
  }
  interface Dragger {
    new(options: DraggerOptions): Dragger;
    startElement: string | HTMLElement;
    onDragStart: (pointer: Event | Touch) => void;
    onDragMove: (pointer: Event | Touch, moveX: number, moveY: number) => void;
    onDragEnd: () => void; 
  }
  interface Illustration extends Anchor, Dragger{
    new(options: IllustrationOptions): Illustration;
    element: string | HTMLCanvasElement | SVGElement;
    zoom: number;
    centered: boolean;
    dragRotate: boolean;
    resize: boolean | 'fullscreen';
    onResize: (width?: number, height?: number) => void;
    onPrerender: (context: CanvasRenderingContext2D | SVGElement) => void;
    renderGraph(scene?: Anchor): void;
    updateRenderGraph(scene?: Anchor): void;
    setSize(width: number, height: number): void;
  }
  interface Vector {
  
    x: number;
    y: number;
    z: number;
    set(a: VectorOptions): Vector;
    copy(): Vector;
    add(a: VectorOptions): Vector;
    subtract(a: VectorOptions): Vector;
    multiply(a: VectorOptions): Vector;
    rotate(a: VectorOptions): Vector;
    magnitude(): number;
    lerp(point: Vector, alpha: number): Vector;
  }
  interface RectOptions extends ShapeOptions {
    width?: number;
    height?: number;
  }
  interface Rect extends Shape {
    width: number;
    height: number;
  }
  interface RoundedRect extends Shape {
    width: number;
    height: number;
    cornerRadius: number;  
  }
  interface RoundedRectOptions extends ShapeOptions {
    width?: number;
    height?: number;
    cornerRadius?: number;
  }
  interface Ellipse extends Shape {
    diameter: number;
    width: number;
    height: number;
    quarters: number;
  }
  interface EllipseOptions extends Shape {
    diameter?: number;
    width?: number;
    height?: number;
    quarters?: number;
  }
  interface Polygon extends Shape {
    radius: number;
    sides: number;
  }
  interface PolygonOptions extends ShapeOptions {
    radius?: number;
    sides?: number;
  }
  interface Hemisphere extends Shape {
    diameter: number;
  }
  interface HemisphereOptions extends ShapeOptions {
    diameter?: number;
  }
  interface Cone extends Shape {
    diameter: number;
    length: number;
  }
  interface ConeOptions extends ShapeOptions {
    diameter?: number;
    length?: number;
  }
  interface Cylinder extends Shape {
    diameter: number;
    length: number;
    frontFace: string;
  }
  interface CylinderOptions extends ShapeOptions {
    diameter?: number;
    length?: number;
    frontFace?: string;
  }
  interface Box extends Shape {
    width: number;
    height: number;
    depth: number;
    leftFace: string;
    rightFace: string;
    topFace: string;
    bottomFace: string;
  }
  interface BoxOptions extends ShapeOptions {
    width?: number;
    height?: number;
    depth?: number;
    leftFace?: string;
    rightFace?: string;
    topFace?: string;
    bottomFace?: string;
  }
}