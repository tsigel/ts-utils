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

}
