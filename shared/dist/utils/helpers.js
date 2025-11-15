"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pick = exports.omit = exports.isEmptyObject = exports.sleep = void 0;
const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
exports.sleep = sleep;
const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
};
exports.isEmptyObject = isEmptyObject;
const omit = (obj, keys) => {
    const result = { ...obj };
    keys.forEach((key) => delete result[key]);
    return result;
};
exports.omit = omit;
const pick = (obj, keys) => {
    const result = {};
    keys.forEach((key) => {
        if (key in obj) {
            result[key] = obj[key];
        }
    });
    return result;
};
exports.pick = pick;
