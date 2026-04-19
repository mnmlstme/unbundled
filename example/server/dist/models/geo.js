"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bboxOfPoints = bboxOfPoints;
exports.bboxOfFeatures = bboxOfFeatures;
exports.featureLngLat = featureLngLat;
function bboxOfPoints(points, padding) {
    if (padding === void 0) { padding = 0; }
    // TODO: make this wrap around at -180/180
    var minLng = points
        .map(function (pt) { return pt.lon; })
        .reduce(function (a, b) { return Math.min(a, b); }, 180);
    var minLat = points
        .map(function (pt) { return pt.lat; })
        .reduce(function (a, b) { return Math.min(a, b); }, 180);
    var maxLng = points
        .map(function (pt) { return pt.lon; })
        .reduce(function (a, b) { return Math.max(a, b); }, -180);
    var maxLat = points
        .map(function (pt) { return pt.lat; })
        .reduce(function (a, b) { return Math.max(a, b); }, -180);
    var padLng = padding * (maxLng - minLng);
    var padLat = padding * (maxLat - minLat);
    return [
        { lon: minLng - padLng, lat: minLat - padLat },
        { lon: maxLng + padLng, lat: maxLat + padLat }
    ];
}
function bboxOfFeatures(features, padding) {
    if (padding === void 0) { padding = 0.125; }
    var featurePts = function (ft) {
        if ("lat" in ft && "lon" in ft)
            return [ft];
        if ("path" in ft)
            return bboxOfPoints(ft.path); // unpadded
        return [];
    };
    var points = features.map(featurePts).flat();
    return bboxOfPoints(points, padding);
}
function featureLngLat(ft) {
    if ("lat" in ft && "lon" in ft)
        return [ft.lon, ft.lat];
    if ("path" in ft) {
        var _a = bboxOfFeatures(ft.path), pt0 = _a[0], pt1 = _a[1];
        return [(pt0.lon + pt1.lon) / 2, (pt0.lat + pt1.lat) / 2];
    }
    return [0, 0];
}
