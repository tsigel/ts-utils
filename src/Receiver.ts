import { Signal } from './Signal';
import { IHash } from './utils';


export type TStopArg1 = Signal<any> | Signal.IHandler<any, any>;

export class Receiver {

    private __received: IHash<IHashItem>;

    public receive<T, R>(signal: Signal<T>, handler: Signal.IHandler<T, R>, context?: R): void {
        receive.call(this, signal, handler, context, false);
    }

    public receiveOnce<T, R>(signal: Signal<T>, handler: Signal.IHandler<T, R>, context?: R): void {
        receive.call(this, signal, handler, context, true);
    }

    public stopReceive(item?: TStopArg1, handler?: Signal.IHandler<any, any>): void {
        if (!this.__received) {
            return null;
        }

        if (typeof item === 'function') {
            handler = item;
            item = null;
        }

        if (!item) {
            Object.keys(this.__received).forEach((cid) => {
                this.stopReceive(this.__received[cid].signal, handler);
            });
            return null;
        }
        if (!handler) {
            this.__received[(item as Signal<any>).cid].handlers.slice().forEach((myHandler) => {
                this.stopReceive(item, myHandler);
            });
            return null;
        }

        const handlers = this.__received[(item as Signal<any>).cid].handlers;
        for (let i = handlers.length; i--;) {
            if (handlers[i] === handler) {
                handlers.splice(i, 1);
                this.__received[(item as Signal<any>).cid].signal.off(handler, this);
            }
        }
        if (!handlers.length) {
            delete this.__received[(item as Signal<any>).cid];
        }
    }

}

function receive<T, R>(signal: Signal<T>, handler: Signal.IHandler<T, R>, context: R, isOnce: boolean): void {
    if (!this.__received) {
        this.__received = Object.create(null);
    }
    if (isOnce) {
        signal.once(handler, context, this);
    } else {
        signal.on(handler, context, this);
    }

    if (!this.__received[signal.cid]) {
        this.__received[signal.cid] = {
            handlers: [handler],
            signal
        };
    } else {
        this.__received[signal.cid].handlers.push(handler);
    }
}

export interface IReceiver {
    receive<T, R>(signal: Signal<T>, handler: Signal.IHandler<T, R>, context?: R): void;

    receiveOnce<T, R>(signal: Signal<T>, handler: Signal.IHandler<T, R>, context?: R): void;

    stopReceive(item?: Signal<any>, handler?: Signal.IHandler<any, any>): void;

    stopReceive(item?: Signal.IHandler<any, any>): void;
}

interface IHashItem {
    signal: Signal<any>;
    handlers: Array<Signal.IHandler<any, any>>;
}
