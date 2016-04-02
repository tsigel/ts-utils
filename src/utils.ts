module utils {
    'use strict';
    
    const types = {
        string: '[object String]',
        number: '[object Number]',
        object: '[object Object]',
        array: '[object Array]'
    };
    
    const toString = Object.prototype.toString;

    export function isObject(some: any): boolean {
        return toString.call(some) === types.object;
    }
    
    export function isEmpty(some: any): boolean {
        return some == null;
    }
    
    export function isNotEmpty(some: any): boolean {
        return some != null;
    }
    
    export function isString(some: any): boolean {
        return toString.call(some) === types.string;
    }
    
    export function isNumber(some: any): boolean {
        return toString.call(some) === types.number;
    }
    
    export function isArray(some: any): boolean {
        return toString.call(some) === types.array; 
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

    export function numToLength(num: number, length: number): string {
        let str = String(num);
        for (let i = str.length; i < length; i++) {
            str = '0' + str;
        }
        return str;
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
    
    export function some<T>(some: Object, callback: ISomeCallback<T>): boolean {
        return Object.keys(some).some((key: string) => callback(some[key], key));
    }
    
    export interface ISomeCallback<T> {
        (data?: T, key?: string): boolean;
    }
    
    export interface IEachCallback<T> {
        (data?: T, key?: string): any;
    }
}
