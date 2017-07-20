import {
    each, IHash, isNotEmpty, isNull, isNumber, isObject, ISplitRangeOptions, isString, isUndefined,
    numToLength, round, splitRange
} from './utils';


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
    const functions = [];
    each(options as IHash<boolean>, (value: boolean, optionName: keyof IEmptyFilterOptions) => {
        if (EMPTY_FUNCS_MAP[optionName] && value) {
            functions.push(EMPTY_FUNCS_MAP[optionName]);
        }
    });
    if (!functions.length) {
        return Boolean;
    } else {
        return (data: T) => {
            return functions.some((f: Function) => f(data)) || !!data;
        };
    }
}

export function contains<T>(data: Object): IFilter<T, boolean> {
    const keys = Object.keys(data);
    return (localData: T): boolean => {
        if (!isObject(localData)) {
            return false;
        }
        return keys.every((key: string) => data[key] === localData[key]);
    };
}

export function containsDeep<T>(data: Object): IFilter<T, boolean> {

    const check = (origin: any, local: any): boolean => {
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

export function roundFilter(len?: number): IFilter<number, number> {
    return (num: number) => round(num, len);
}

export function splitRangeFilter(data?: ISplitRangeOptions,
                                 processor?: IFilter<number, number>): IFilter<number, string> {

    return (num: number) => splitRange(num, data, processor);
}

export function roundSplit(len?: number, data?: ISplitRangeOptions): IFilter<number, string> {
    return splitRangeFilter(data, roundFilter(len));
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

const dateParsers = [
    {
        pattern: 'YYYY',
        handler: (localDate: Date): string => String(localDate.getFullYear())
    },
    {
        pattern: 'YY',
        handler: (localDate: Date): string => String(localDate.getFullYear()).substr(2)
    },
    {
        pattern: 'MM',
        handler: (localDate: Date): string => String(numToLength(localDate.getMonth() + 1, 2))
    },
    {
        pattern: 'M',
        handler: (localDate: Date): string => String(localDate.getMonth() + 1)
    },
    {
        pattern: 'DD',
        handler: (localDate: Date): string => String(numToLength(localDate.getDate(), 2))
    },
    {
        pattern: 'D',
        handler: (localDate: Date): string => String(localDate.getDate())
    },
    {
        pattern: 'hh',
        handler: (localDate: Date): string => String(numToLength(localDate.getHours(), 2))
    },
    {
        pattern: 'h',
        handler: (localDate: Date): string => String(localDate.getHours())
    },
    {
        pattern: 'mm',
        handler: (localDate: Date): string => String(numToLength(localDate.getMinutes(), 2))
    },
    {
        pattern: 'm',
        handler: (localDate: Date): string => String(localDate.getMinutes())
    },
    {
        pattern: 'ss',
        handler: (localDate: Date): string => String(numToLength(localDate.getSeconds(), 2))
    },
    {
        pattern: 's',
        handler: (localDate: Date): string => String(localDate.getSeconds())
    }
];

interface IDatePattern {
    pattern: string;
    handler: (localDate: Date) => string;
}

export function date(pattern: string, processor?: IFilter<any, Date | number>): IFilter<any, string> {
    const localPatterns = [];
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
            const result = processor(toParse);
            return isNumber(result) ? new Date(<number>result) : <Date>result;
        };
    } else {
        parse = (data: Date | number) => {
            return isNumber(data) ? new Date(<number>data) : <Date>data;
        };
    }
    return (localDate: any): string => {
        const _date = parse(localDate);
        return localPatterns.reduce((result: string, datePattern: IDatePattern) => {
            return result.replace(datePattern.pattern, datePattern.handler(_date));
        }, pattern);
    };
}

/* tslint:disable */
export interface date {
    (pattern: string): IFilter<Date | number, string>;

    (pattern: string, processor: IFilter<any, number | Date>): IFilter<any, string>;
}
/* tslint:enable */

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
