import { isArray, isFunction } from './utils';
import { contains, IFilter } from './filters';


export function find<T extends object>(some: T[] | { [key: string]: T },
                                       target: object | IFilter<T, boolean>): T | void {

    let filter = isFunction(target) ? <IFilter<T, boolean>>target : contains(target);
    let result = null;

    if (isArray(some)) {
        (<Array<T>>some).some((data: T) => {
            if (filter(data)) {
                result = data;
                return true;
            }
        });
    } else {
        Object.keys(<{ [key: string]: T }>some).some((key: string) => {
            if (filter(some[key])) {
                result = <{ [key: string]: T }>some[key];
                return true;
            }
        });
    }
    return result;
}

export function binaryFind<T extends object>(some: Array<T>, target: (data: T) => -1 | 0 | 1): T | void {
    let result = null;

    const step = function (arr: Array<T>): void {
        const index = Math.round(arr.length / 2);
        const item = arr[index];
        switch (target(item)) {
            case -1:
                step(arr.slice(0, index));
                break;
            case 0:
                result = item;
                break;
            case 1:
                step(arr.slice(index));
                break;
        }
    };

    step(some.slice());

    return result;
}

export function binaryFirstFind<T extends object>(some: Array<T>, target: (data: T) => boolean): void {
    let result = null;

    const step = function (arr: Array<T>): void {
        const index = Math.round(arr.length / 2);
        const item = arr[index];
        if (target(item)) {
            if (target(arr[index - 1])) {
                step(arr.slice(0, index));
            } else {
                result = item;
            }
        } else {
            step(arr.slice(index));
        }
    };

    step(some.slice());

    return result;
}
