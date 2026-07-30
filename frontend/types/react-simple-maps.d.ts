declare module "react-simple-maps" {
  import { ComponentType, ReactNode, SVGProps } from "react";

  export interface ComposableMapProps extends SVGProps<SVGSVGElement> {
    projection?: string | ProjectionConfig;
    projectionConfig?: ProjectionConfig;
    width?: number;
    height?: number;
    className?: string;
    children?: ReactNode;
  }

  export interface ProjectionConfig {
    scale?: number;
    center?: [number, number];
    translate?: [number, number];
    rotate?: [number, number, number];
  }

  export interface ZoomableGroupProps {
    center?: [number, number];
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    translateExtent?: [[number, number], [number, number]];
    onMoveStart?: (position: { x: number; y: number; zoom: number }) => void;
    onMove?: (position: { x: number; y: number; zoom: number }) => void;
    onMoveEnd?: (position: { x: number; y: number; zoom: number }) => void;
    className?: string;
    style?: React.CSSProperties;
    children?: ReactNode;
  }

  export interface GeographiesProps {
    geography: string | object;
    parseGeographies?: (geographies: any[]) => any[];
    children?: (data: { geographies: any[]; path: any; projection: any }) => ReactNode;
  }

  export interface GeographyProps extends SVGProps<PathElement> {
    geography: any;
    data?: any;
    round?: boolean;
    projection?: any;
    path?: any;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
    onMouseEnter?: (e: React.MouseEvent) => void;
    onMouseMove?: (e: React.MouseEvent) => void;
    onMouseLeave?: (e: React.MouseEvent) => void;
    onClick?: (e: React.MouseEvent) => void;
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const ZoomableGroup: ComponentType<ZoomableGroupProps>;
  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<GeographyProps>;
  export const Marker: ComponentType<any>;
  export const Line: ComponentType<any>;
  export const Annotation: ComponentType<any>;
}
