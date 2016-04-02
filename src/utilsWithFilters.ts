/// <reference path="filters.ts"/>
/// <reference path="utils.ts"/>


module utils {
    'use strict';

    export function find<T extends Object>(some: T[]|{[key: string]: T},
                                           target: Object|filters.IFilter<T, boolean>): T|void {
        
        let filter = isFunction(target) ? <filters.IFilter<T, boolean>>target : filters.contains(target);
        let result = null;
        if (isArray(some)) {
            (<Array<T>>some).some((data: T) => {
                if (filter(data)) {
                    result = data;
                    return true;
                }
            });
        } else {
            Object.keys(<{[key: string]: T}>some).some((key: string) => {
                if (filter(some[key])) {
                    result = <{[key: string]: T}>some[key];
                    return true;
                }
            });
        }
        return result;
    }
}
