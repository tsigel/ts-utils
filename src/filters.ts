import {
    each,
    get,
    getPaths,
    IHash,
    isNotEmpty,
    isNull,
    isNumber,
    isObject,
    ISplitRangeOptions,
    isString,
    isUndefined,
    numToLength,
    round,
    splitRange
} from './utils';
import { Path } from './Path';


const EMPTY_FUNCS_MAP = {
    skipNumber: isNumber,
    skipString: isString,
    skipNotEmpty: isNotEmpty,
    skipNull: isNull,
    skipUndefined: isUndefined
};

export function filterList<T>(...filters: Array<IFilter<T, boolean>>): IFilter<T, boolean> {
    if (!filters.length) {
        return () => true;
    }
    return function (item) {
        return filters.every((filter) => filter(item));
    };
}

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

export function contains<T>(data: Partial<T>): IFilter<T, boolean> {
    if (typeof data === 'object') {
        const keys = Object.keys(data);
        return (localData: T): boolean => {
            if (!isObject(localData)) {
                return false;
            }
            return keys.every((key: keyof T) => data[key] === localData[key]);
        };
    } else {
        return (localData: T) => {
            return data === localData;
        };
    }
}

export function containsDeep<T extends object>(data: Partial<T>): IFilter<T, boolean> {

    const paths = getPaths(data);
    const check = function (localData: object): boolean {
        return paths.every(function (parts: Path): boolean {
            return get(data, parts) === get(localData, parts);
        });
    };

    return (localData: T): boolean => {
        if (typeof localData === 'object') {
            return check(localData as any);
        } else {
            return false;
        }
    };
}

export function notContains<T>(data: Partial<T>): IFilter<T, boolean> {
    return not(contains(data));
}

export function notContainsDeep<T extends object>(data: Partial<T>): IFilter<T, boolean> {
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

export function getBinaryFilter<T extends object>(data: Partial<T>): IBinaryFilter<T> {
    const dataPaths = getPaths(data);

    if (dataPaths.length === 1) {
        const [path] = dataPaths;
        const value = get(data, path);
        return function (item: T): -1 | 0 | 1 {
            const itemValue = get(item, path);
            return itemValue > value ? -1 : itemValue === value ? 0 : 1;
        };
    } else {
        const pathsStr = dataPaths.map(String);
        const pathsHash = Object.create(null);
        dataPaths.forEach((path) => {
            pathsHash[String(path)] = get(data, path);
        });
        return function (item: T): -1 | 0 | 1 {
            const map = dataPaths.map((path, i) => {
                const itemValue = get(item, path);
                const pathStr = pathsStr[i];
                return itemValue > pathsHash[pathStr] ? -1 : itemValue === pathsHash[pathStr] ? 0 : 1;
            });
            const witoutZero = map.filter(Boolean);
            if (witoutZero.length === 0) {
                return 0;
            } else {
                return witoutZero[0];
            }
        };
    }
}

export interface IBinaryFilter<T> {
    (data: T): -1 | 0 | 1;
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
