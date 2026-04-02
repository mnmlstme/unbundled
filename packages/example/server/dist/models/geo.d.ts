import { LineString } from "geojson";
export interface Point {
    lat: number;
    lon: number;
}
export interface Region {
    path: Array<Point>;
}
type Feature = Point | Region;
export interface Place {
    name: string;
    feature: Feature;
}
export interface Route {
    distance: number;
    duration: number;
    legs: RouteLeg[];
    geometry: LineString;
}
export interface RouteLeg {
    distance: number;
    duration: number;
    summary: string;
}
export declare function bboxOfPoints(points: Point[], padding?: number): {
    lon: number;
    lat: number;
}[];
export declare function bboxOfFeatures(features: Feature[], padding?: number): {
    lon: number;
    lat: number;
}[];
export declare function featureLngLat(ft: Feature): number[];
export {};
