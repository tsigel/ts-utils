module utils {
    'use strict';
    
    const types = {
        string: '[object String]',
        number: '[object Number]',
        object: '[object Object]',
        array: '[object Array]'
    };
    
    const toString = Object.prototype.toString;
    
    export let DEFAULT_NUMBER_SEPARATOR = '.';

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

    export function round(num: number, len?: number): number {
        let factor = Math.pow(10, len || 2);
        return Math.round(num * factor) / factor;
    }

    export function splitRange(num: number,
                               options?: ISplitRangeOptions,
                               processor?: utils.filters.IFilter<number, number>): string {
        
        if (processor) {
            num = processor(num);
        }
        let str = String(num);
        let numData = str.split('.');
        let integral = numData[0],
            fractional = numData[1];

        integral = integral.split('').reverse().join('');
        integral = integral.replace(/(\d{3})/g, '$1 ')
            .split('').reverse().join('').replace(/\s/g, options && options.nbsp ? '&nbsp;' : ' ').trim();

        if (fractional) {
            return integral + (options && options.separator || DEFAULT_NUMBER_SEPARATOR) + fractional;
        }
        return integral;
    }
    
    export interface ISplitRangeOptions {
        nbsp?: boolean;
        separator?: string;
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
