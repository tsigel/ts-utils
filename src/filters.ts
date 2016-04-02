///<reference path="./utils.ts"/>


module utils.filters {
    'use strict';

    export interface IProcessor<T> {
        (data: T): any;
    }

    export interface IFilter<P, R> {
        (data: P): R;
    }

    export interface IEmptyFilterOptions {
        skipNumber?: boolean;
        skipString?: boolean;
        skipNotEmpty?: boolean;
        skipNull?: boolean;
        skipUndefined?: boolean;
    }

    const EMPTY_FUNCS_MAP = {
        skipNumber: isNumber,
        skipString: isString,
        skipNotEmpty: isNotEmpty,
        skipNull: isNull,
        skipUndefined: isUndefined
    };

    export function not<T>(processor?: IProcessor<T>): IFilter<T, boolean> {
        if (processor) {
            return (data: T) => !processor(data);
        } else {
            return (data: T) => !data;
        }
    }

    export function empty<T>(options?: IEmptyFilterOptions): IFilter<T, boolean> {

        if (!options) {
            return Boolean;
        }
        let funcs = [];
        each(options, (value: boolean, optionName: string) => {
            if (EMPTY_FUNCS_MAP[optionName] && value) {
                funcs.push(EMPTY_FUNCS_MAP[optionName]);
            }
        });
        if (!funcs.length) {
            return Boolean;
        } else {
            return (data: T) => {
                return funcs.some((f: Function) => f(data)) || !!data;
            };
        }
    }

    export function contains<T>(data: Object): IFilter<T, boolean> {
        let keys = Object.keys(data);
        return (localData: T): boolean => {
            if (!isObject(localData)) {
                return false;
            }
            return keys.every((key: string) => data[key] === localData[key]);
        };
    }

    export function containsDeep<T>(data: Object): IFilter<T, boolean> {

        let check = (origin: any, local: any): boolean => {
            return Object.keys(origin).every((key: string) => {
                if (isObject(origin[key])) {
                    if (isObject(local[key])) {
                        return check(origin[key], local[key]);
                    } else {
                        return false;
                    }
                } else {
                    return origin[key] === local[key];
                }
            });
        };

        return (localData: T): boolean => {
            if (isObject(localData)) {
                return check(data, localData);
            } else {
                return false;
            }
        };
    }
    
    export function notContains<T>(data: Object): IFilter<T, boolean> {
        return not(contains(data));
    }
    
    export function notContainsDeep<T>(data: Object): IFilter<T, boolean> {
        return not(containsDeep(data));
    }
    
    export function equal<T>(some: T, noStrict?: boolean): IFilter<T, boolean> {
        if (noStrict) {
            return (data: T): boolean => {
                /* tslint:disable */
                return some == data;
                /* tslint:enable */
            };
        }
        return (data: T): boolean => {
            return some === data;
        };
    }
    
    export function notEqual<T>(some: T, noStrict?: boolean): IFilter<T, boolean> {
        return not(equal(some, noStrict));
    }

}
