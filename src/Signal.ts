/// <reference path='utils.ts' />
/// <reference path='filters.ts' />
/// <reference path='utilsWithFilters.ts' />

module utils {
    'use strict';

    export class Signal<T> {

        private _handlers: Array<Signal.IHandlerData<T>> = [];

        public on(handler: Signal.IHandler<T>): void {
            this._handlers.push({
                isOnce: false,
                handler: handler
            });
        }

        public once(handler: Signal.IHandler<T>): void {
            this._handlers.push({
                isOnce: true,
                handler: handler
            });
        }

        public off(handler?: Signal.IHandler<T>): void {
            if (handler) {
                this._handlers = this._handlers.filter(filters.notContains({handler: handler}));
            } else {
                this._handlers = [];
            }
        }

        public dispatch(some: T): void {
            this._handlers.slice().forEach((handlerData: Signal.IHandlerData<T>) => {
                if (handlerData.isOnce) {
                    this.off(handlerData.handler);
                }
                handlerData.handler(some);
            });
        }

    }

    export module Signal {

        export interface IHandler<T> {
            (data: T): any;
        }

        export interface IHandlerData<T> {
            isOnce: boolean;
            handler: IHandler<T>;
        }

    }

}
