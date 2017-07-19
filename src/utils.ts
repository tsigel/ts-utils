import {IFilter} from './filters';


const TYPES = {
    string: '[object String]',
    number: '[object Number]',
    object: '[object Object]',
    array: '[object Array]'
};

const toString = Object.prototype.toString;

export let DEFAULT_NUMBER_SEPARATOR = '.';

export function isObject(param: any): boolean {
    return toString.call(param) === TYPES.object;
}

export function isEmpty(param: any): boolean {
    return param == null;
}

export function isNotEmpty(param: any): boolean {
    return param != null;
}

export function isString(param: any): boolean {
    return toString.call(param) === TYPES.string;
}

export function isNumber(param: any): boolean {
    return toString.call(param) === TYPES.number;
}

export function isArray(param: any): boolean {
    return toString.call(param) === TYPES.array;
}

export function isNull(param: any): boolean {
    return param === null;
}

export function isUndefined(param: any): boolean {
    return param === undefined;
}

export function isNaN(param: any): boolean {
    return isNumber(param) && (<any>window).isNaN(param);
}

export function isFunction(param: any): boolean {
    return typeof param === 'function';
}

export function numToLength(num: number, length: number): string {
    let str = String(num);
    for (let i = str.length; i < length; i++) {
        str = '0' + str;
    }
    return str;
}

export function round(num: number, len?: number): number {
    len = len || 2;
    return Number(Math.round(Number(num + 'e' + len)) + 'e-' + len);
}

export function splitRange(num: number,
                           options?: ISplitRangeOptions,
                           processor?: IFilter<number, number>): string {

    if (processor) {
        num = processor(num);
    }
    const str = String(num);
    const numData = str.split('.');
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

export function each<T>(param: Object, callback: IEachCallback<T>, context?: any): void {
    if (!isObject(param)) {
        return null;
    }
    if (context) {
        return Object.keys(param).forEach((key: string) => callback.call(context, param[key], key));
    } else {
        return Object.keys(param).forEach((key: string) => callback(param[key], key));
    }
}

export function some<T>(param: Object, callback: ISomeCallback<T>): boolean {
    return Object.keys(param).some((key: string) => callback(param[key], key));
}

export interface ISomeCallback<T> {
    (data?: T, key?: string): boolean;
}

export interface IEachCallback<T> {
    (data?: T, key?: string): any;
}
