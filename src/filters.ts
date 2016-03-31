module utils.filters {
    'use strict';

    export interface IProcessor<T> {
        (data: T): any;
    }

    export interface IFilter<P, R> {
        (data: P): R;
    }
    
    export function not<T>(processor?: IProcessor<T>): IFilter<T, boolean> {
        if (processor) {
            return (data: T) => !processor(data);
        } else {
            return (data: T) => !data;
        }
    }

}
