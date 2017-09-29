import { IPathItem, Path, PATH_TYPE } from './Path';
import { IFilter } from './filters';

/**
 * @private
 * @type {{string: string; number: string; object: string; array: string}}
 */
const TYPES = {
    string: '[object String]',
    number: '[object Number]',
    boolean: '[object Boolean]',
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
 * Is the parameter an boolean
 * @param param
 * @returns {boolean}
 */
export function isBoolean(param: any): boolean {
    return toString.call(param) === TYPES.boolean;
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
 *
 * @param param
 * @returns {TTypes}
 */
export function typeOf(param: any): TTypes {
    const type = typeof param;
    switch (type) {
        case 'object':
            if (param === null) {
                return 'null';
            } else {
                const checkList = [
                    { check: isArray, type: 'array' },
                    { check: isObject, type: 'object' },
                    { check: isString, type: 'string' },
                    { check: isNumber, type: 'number' },
                    { check: isBoolean, type: 'boolean' }
                ];
                let $type = 'null' as TTypes;
                checkList.some((item) => {
                    if (item.check(param)) {
                        $type = item.type as TTypes;
                    }
                    return $type !== 'null';
                });
                return $type as TTypes;
            }
        default:
            return type as TTypes;
    }
}

/**
 * Give the number to a certain number of symbols
 *
 * @example
 * numToLength(22, 3) // returns '022'
 * @example
 * numToLength(new Date().getHours(), 2) //returns '06'
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
 * splitRange(21257.32, {separator: ','}) // returns '21 257,32'
 *
 * @example
 * splitRange(21257.322, {separator: ','}, (num) => round(num, 2)) // returns '21 257,32'
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
 * @param {Array<T> | IHash<T>} param
 * @param {(data: T, key: (string | number))} callback
 * @param context
 */
export function each<T>(param: Array<T> | IHash<T>,
                        callback: (data: T, key: string | number) => any,
                        context?: any): void {

    if (typeof param !== 'object' || !param) {
        return null;
    }
    if (context) {
        return Array.isArray(param) ? param.forEach(callback, context) :
            Object.keys(param).forEach((key: string) => callback.call(context, param[key], key));
    } else {
        return Array.isArray(param) ? param.forEach(callback) :
            Object.keys(param).forEach((key: string) => callback(param[key], key));
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

/**
 * Get some data from object by string path
 *
 * @example
 * get({a: {b: 1}}), 'a.b') // returns 1
 *
 * @param {Object} data
 * @param {string} path
 * @returns {T}
 */
export function get<T>(data: object, path: string | Path): T {
    let tmp = data;
    const parts = isString(path) ? Path.parse(path as string) : path as Path;

    parts.some((item) => {
        if (typeof tmp === 'object' && tmp !== null && (item.name in tmp)) {
            tmp = tmp[item.name];
        } else {
            tmp = null;
            return true;
        }
    });

    return tmp as any;
}

/**
 * Set some data to object by string path
 *
 * @example
 * var some = {};
 * set(some), 'a.b', 1) // some equal {a: {b: 1}}
 *
 * @param {Object} data
 * @param {string} path
 * @param value
 */
export function set(data: object, path: string | Path, value: any): void {
    let tmp = data;
    const parts: Path = isString(path) ? Path.parse(path as string) : path as Path;

    parts.forEach((itemData, index) => {
        const isLast = index === parts.length - 1;

        if (isLast) {
            tmp[itemData.name] = value;
        } else {
            if (typeof tmp[itemData.name] !== 'object') {
                tmp[itemData.name] = itemData.nextContainer;
            }
            tmp = tmp[itemData.name];
        }
    });
}

export function getLayers(data: object, path: string | Path): Array<{ name: string, data: any, parent: object }> {
    let tmp = data;
    let layers = [{ name: null, data, parent: null }];
    const parts: Path = isString(path) ? Path.parse(path as string) : path as Path;

    parts.forEach((item) => {
        if (tmp) {
            layers.push({ name: item.name, data: tmp[item.name], parent: tmp });
            tmp = tmp[item.name];
        } else {
            layers = null;
        }
    });

    return layers;
}

export function unset(data: object, path: string | Path): void {
    (getLayers(data, path) || []).reverse().some((item, index): any => {
        if (index === 0) {
            if (item.parent) {
                delete item.parent[item.name];
            }
        } else {
            if (item.parent && Object.keys(item.data).length === 0) {
                delete item.parent[item.name];
            }
        }
    });
}

let counter = 0;

export function uniqueId(prefix: string = '' as string): string {
    return `${prefix}${counter++}`;
}

export function result(param: any): any {
    if (isFunction(param)) {
        return param();
    } else {
        return param;
    }
}

/**
 * Get array all path from object
 *
 * @example
 * getPaths({a: {b: 1, c: 2}, d: 1}) // return [['a', 'b'], ['a', 'c'], ['d']]
 *
 * @param {Object} param
 * @returns {Array<Array<string>>}
 */
export function getPaths(param: object): Array<Path> {
    const paths = [];

    function getIterate(parents: Array<IPathItem>, array?: boolean): (value: any, key: string) => void {
        const iterate = function (value: any, key: string): void {
            const newLine = parents.slice();
            newLine.push({ type: array ? PATH_TYPE.Array : PATH_TYPE.Object, name: key });
            if (isObject(value)) {
                each(value, getIterate(newLine));
            } else if (isArray(value)) {
                each(value, getIterate(newLine, true));
            } else {
                paths.push(newLine);
            }
        };
        return iterate;
    }

    const firstLine = [];
    each(param, getIterate(firstLine, isArray(param)));

    return paths.map((pathParts) => new Path(pathParts));
}

export function clone<T>(data: T): T {
    switch (typeof data) {
        case 'object':
            if (data === null) {
                return null;
            }
            if (Array.isArray(data)) {
                return data.slice() as any;
            } else {
                return { ...data as any };
            }
        default:
            return data;
    }
}

export function cloneDeep<T>(data: T): T {
    switch (typeof data) {
        case 'object':
            const paths = getPaths(data as any);
            const $clone = isArray(data) ? [] : Object.create(null);

            paths.forEach((path) => {
                const value = get(data as any, path);
                set($clone, path, value);
            });

            return $clone;
        default:
            return data;
    }
}

export function merge<T>(origin: Partial<T>, ...args: Array<Partial<T>>): Partial<T> {
    args.forEach((part) => {
        const paths = getPaths(part);
        paths.forEach((path) => {
            const value = get(part, path);
            set(origin, path, value);
        });
    });
    return origin;
}

export function defaults<T extends object>(target: Partial<T>, ...args: Array<Partial<T>>): Partial<T> {
    const paths = getPaths(target).map(String);
    args.reverse().forEach((item) => {
        const itemPaths = getPaths(item);
        itemPaths.forEach((path) => {
            const stringPath = path.toString();
            if (paths.indexOf(stringPath) === -1) {
                paths.push(stringPath);
                set(target, path, get(item, path));
            }
        });
    });
    return target;
}

export interface ISplitRangeOptions {
    nbsp?: boolean;
    separator?: string;
}

export interface ISomeCallback<T> {
    (data?: T, key?: string): boolean;
}

export interface IHash<T> {
    [key: string]: T;
}

export type TTypes =
    'string'
    | 'number'
    | 'object'
    | 'function'
    | 'array'
    | 'null'
    | 'undefined'
    | 'boolean';
