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
    
    let dateParsers = [
        {
            pattern: 'YYYY',
            handler: (date: Date): string => String(date.getFullYear())
        },
        {
            pattern: 'YY',
            handler: (date: Date): string => String(date.getFullYear()).substr(2)
        },
        {
            pattern: 'MM',
            handler: (date: Date): string => String(numToLength(date.getMonth() + 1, 2))
        },
        {
            pattern: 'M',
            handler: (date: Date): string => String(date.getMonth() + 1)
        },
        {
            pattern: 'DD',
            handler: (date: Date): string => String(numToLength(date.getDate(), 2))
        },
        {
            pattern: 'D',
            handler: (date: Date): string => String(date.getDate())
        },
        {
            pattern: 'hh',
            handler: (date: Date): string => String(numToLength(date.getHours(), 2))
        },
        {
            pattern: 'h',
            handler: (date: Date): string => String(date.getHours())
        },
        {
            pattern: 'mm',
            handler: (date: Date): string => String(numToLength(date.getMinutes(), 2))
        },
        {
            pattern: 'm',
            handler: (date: Date): string => String(date.getMinutes())
        },
        {
            pattern: 'ss',
            handler: (date: Date): string => String(numToLength(date.getSeconds(), 2))
        },
        {
            pattern: 's',
            handler: (date: Date): string => String(date.getSeconds())
        }
    ];
    
    interface IDatePattern {
        pattern: string;
        handler: (date: Date) => string;
    }
    
    export function date(pattern: string, processor?: IFilter<any, Date|number>): IFilter<any, string> {
        let localPatterns = [];
        let forFind = pattern;
        let parse;
        dateParsers.forEach((datePattern: IDatePattern) => {
            if (forFind.indexOf(datePattern.pattern) !== -1) {
                forFind = forFind.replace(datePattern.pattern, '');
                localPatterns.push(datePattern);
            }
        });
        if (processor) {
            parse = (toParse: any) => {
                let result = processor(toParse);
                return isNumber(result) ? new Date(<number>result) : <Date>result;
            };
        } else {
            parse = (data: Date|number) => {
                return isNumber(data) ? new Date(<number>data) : <Date>data;
            };
        }
        return (date: any): string => {
            let _date = parse(date);
            return localPatterns.reduce((result: string, datePattern: IDatePattern) => {
                return result.replace(datePattern.pattern, datePattern.handler(_date));
            }, pattern);
        };
    }

    /* tslint:disable */
    export interface date {
        (pattern: string): IFilter<Date|number, string>;
        (pattern: string, processor: IFilter<any, number|Date>): IFilter<any, string>;
    }
    /* tslint:enable */

}
