import { isArray, isFunction } from './utils';
import { contains, IBinaryFilter, IFilter } from './filters';


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

export function binaryFind<T extends object>(some: Array<T>, target: IBinaryFilter<T>): IBinaryResult<T> {
    let result = {
        index: -1,
        value: null
    };
    let delta = 0;

    const step = function (arr: Array<T>): void {
        const index = Math.floor(arr.length / 2);
        const item = arr[index];
        switch (target(item)) {
            case -1:
                step(arr.slice(0, index));
                break;
            case 0:
                result = { index: index + delta, value: item };
                break;
            case 1:
                delta += index;
                step(arr.slice(index));
                break;
        }
    };

    step(some.slice());

    return result;
}

export interface IBinaryResult<T> {
    index: number;
    value: T | void;
}
