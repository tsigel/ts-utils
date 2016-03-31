module utils {
    'use strict';

    export function isObject(some: any): boolean {
        return typeof some === 'object' && !isNull(some) && !Array.isArray(some);
    }
    
    export function isEmpty(some: any): boolean {
        return some == null;
    }
    
    export function isNotEmpty(some: any): boolean {
        return some != null;
    }
    
    export function isString(some: any): boolean {
        return typeof some === 'string' || (!isEmpty(some) && some.constructor === String);
    }
    
    export function isNumber(some: any): boolean {
        return typeof some === 'number' || (!isEmpty(some) && some.constructor === Number);
    }
    
    export function isArray(some: any): boolean {
        return Array.isArray(some);
    }
    
    export function isNull(some: any): boolean {
        return some === null;
    }
    
    export function isUndefined(some: any): boolean {
        return some === undefined;
    }
    
    export function isNaN(some: any): boolean {
        return isNumber(some) && (<any>window).isNaN(some);
    }
    
    export function isFunction(some: any): boolean {
        return typeof some === 'function';
    }
    
    export function each<T>(some: Object, callback: IEachCallback<T>, context?: any): void {
        if (!isObject(some)) {
            return null;
        } 
        if (context) {
            return Object.keys(some).forEach((key: string) => callback.call(context, some[key], key));
        } else {
            return Object.keys(some).forEach((key: string) => callback(some[key], key));
        }
    }
    
    export interface IEachCallback<T> {
        (data?: T, key?: string): any;
    }
}
