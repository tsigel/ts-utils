import {IFilter} from './filters';

/**
 * @private
 * @type {{string: string; number: string; object: string; array: string}}
 */
const TYPES = {
    string: '[object String]',
    number: '[object Number]',
    object: '[object Object]',
    array: '[object Array]'
};

/**
 * @private
 * @type {() => string}
 */
const toString = Object.prototype.toString;

export let DEFAULT_NUMBER_SEPARATOR = '.';

/**
 * Check the parameter type
 * Is the parameter an object
 * @param param
 * @returns {boolean}
 */
export function isObject(param: any): boolean {
    return toString.call(param) === TYPES.object;
}

/**
 * Check the parameter
 * Whether the parameter is null or undefined
 * @param param
 * @returns {boolean}
 */
export function isEmpty(param: any): boolean {
    return param == null;
}

/**
 * Check the parameter
 * Whether the parameter is not null or is not undefined
 * @param param
 * @returns {boolean}
 */
export function isNotEmpty(param: any): boolean {
    return param != null;
}

/**
 * Check the parameter type
 * Is the parameter an string
 * @param param
 * @returns {boolean}
 */
export function isString(param: any): boolean {
    return toString.call(param) === TYPES.string;
}

/**
 * Check the parameter type
 * Is the parameter an number
 * @param param
 * @returns {boolean}
 */
export function isNumber(param: any): boolean {
    return toString.call(param) === TYPES.number;
}

/**
 * Check the parameter type
 * Is the parameter an array
 * @param param
 * @returns {boolean}
 */
export function isArray(param: any): boolean {
    return toString.call(param) === TYPES.array;
}

/**
 * Check the parameter type
 * Is the parameter an null
 * @param param
 * @returns {boolean}
 */
export function isNull(param: any): boolean {
    return param === null;
}

/**
 * Check the parameter type
 * Is the parameter an undefined
 * @param param
 * @returns {boolean}
 */
export function isUndefined(param: any): boolean {
    return param === undefined;
}

/**
 * Check the parameter type
 * Is the parameter an NaN
 * @param param
 * @returns {boolean}
 */
export function isNaNCheck(param: any): boolean {
    return isNumber(param) && isNaN(param);
}

/**
 * Check the parameter type
 * Is the parameter an function
 * @param param
 * @returns {boolean}
 */
export function isFunction(param: any): boolean {
    return typeof param === 'function';
}

/**
 * Give the number to a certain number of symbols
 *
 * @example
 * // returns '022'
 * numToLength(22, 3)
 * @example
 * // returns '06'
 * numToLength(new Date().getHours(), 2)
 *
 * @param {number} num
 * @param {number} length
 * @returns {string}
 */
export function numToLength(num: number, length: number): string {
    let str = String(num);
    for (let i = str.length; i < length; i++) {
        str = '0' + str;
    }
    return str;
}

/**
 * Safely rounds a number to a character
 * @param {number} num
 * @param {number} len
 * @returns {number}
 */
export function round(num: number, len?: number): number {
    len = len || 2;
    return Number(Math.round(Number(num + 'e' + len)) + 'e-' + len);
}

/**
 * Format a number
 *
 * @example
 * // returns '21 257,32'
 * splitRange(21257.32, {separator: ','})
 *
 * @example
 * // returns '21 257,32'
 * splitRange(21257.322, {separator: ','}, (num) => round(num, 2))
 *
 * @param {number} num
 * @param {ISplitRangeOptions} options format options
 * @param {IFilter<number, number>} processor function for preprocess param
 * @returns {string}
 */
export function splitRange(num: number,
                           options?: ISplitRangeOptions,
                           processor?: IFilter<any, number>): string {

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

/**
 * A generic iterator function, which can be used to seamlessly iterate over objects.
 * Like forEach for array
 * @param {T} param
 * @param {IEachCallback<T extends IHash<K>, K>} callback
 * @param context
 */
export function each<T extends IHash<K>, K>(param: T, callback: IEachCallback<T, K>, context?: any): void {
    if (!isObject(param)) {
        return null;
    }
    if (context) {
        return Object.keys(param).forEach((key: string) => callback.call(context, param[key], key));
    } else {
        return Object.keys(param).forEach((key: string) => callback(param[key], key));
    }
}

/**
 * The general iterator function that can be used to test a particular property.
 * Like some for array
 * @param {Object} param
 * @param {ISomeCallback<T>} callback
 * @returns {boolean}
 */
export function some<T>(param: Object, callback: ISomeCallback<T>): boolean {
    return Object.keys(param).some((key: string) => callback(param[key], key));
}

export interface ISplitRangeOptions {
    nbsp?: boolean;
    separator?: string;
}

export interface ISomeCallback<T> {
    (data?: T, key?: string): boolean;
}

export interface IEachCallback<T extends IHash<K>, K> {
    (data?: K, key?: keyof T): any;
}

export interface IHash<T> {
    [key: string]: T;
}
