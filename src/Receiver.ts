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

    public stopReceive(arg1?: TStopArg1, arg2?: Signal.IHandler<any, any>): void {
        if (!this.__received) {
            return null;
        }

        const signal: Signal<any> = isSignal(arg1) ? arg1 : null;
        const handler: Signal.IHandler<any, any> = (signal ? arg2 : arg1) as Signal.IHandler<any, any>;

        if (!signal) {
            Object.keys(this.__received).forEach((cid) => {
                this.stopReceive(this.__received[cid].signal, arg2);
            });
            return null;
        }

        if (!this.__received[signal.cid] || !this.__received[signal.cid].handlers) {
            return null;
        }

        if (!handler) {
            this.__received[signal.cid].handlers.slice().forEach((myHandler) => {
                this.stopReceive(arg1, myHandler);
            });
            return null;
        }

        const handlers = this.__received[signal.cid].handlers;
        for (let i = handlers.length; i--;) {
            if (handlers[i] === arg2) {
                handlers.splice(i, 1);
                this.__received[signal.cid].signal.off(arg2, this);
            }
        }
        if (!handlers.length) {
            delete this.__received[signal.cid];
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

function isSignal(some: any): some is Signal<any> {
    return some && (some instanceof Signal);
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
