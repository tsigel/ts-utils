import {isArray, isFunction} from './utils';
import {contains, IFilter} from './filters';


export function find<T extends Object>(some: T[] | { [key: string]: T },
                                       target: Object | IFilter<T, boolean>): T | void {

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
