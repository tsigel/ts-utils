import { uniqueId } from './utils';
import { IReceiver } from './Receiver';


export class Signal<T> {

    public cid: string = uniqueId('signal');
    private _handlers: Array<Signal.IHandlerData<T, any>> = [];


    public on<R>(handler: Signal.IHandler<T, R>, context?: R, receiver?: IReceiver): void {
        this._handlers.push({
            isOnce: false,
            handler,
            context,
            receiver
        });
    }

    public once<R>(handler: Signal.IHandler<T, R>, context?: R, receiver?: IReceiver): void {
        this._handlers.push({
            isOnce: true,
            handler,
            context,
            receiver
        });
    }

    public off(handler?: Signal.IHandler<T, any>): void {
        if (handler) {
            for (let i = this._handlers.length; i--;) {
                const handlerData = this._handlers[i];
                if (handlerData.handler === handler) {
                    this._handlers.splice(i, 1);
                    if (handlerData.receiver) {
                        handlerData.receiver.stopReceive(this, handler);
                    }
                }
            }
        } else {
            const handlers = this._handlers.slice();
            this._handlers = [];
            handlers.forEach((data) => {
                if (data.receiver) {
                    data.receiver.stopReceive(this, data.handler);
                }
            });
        }
    }

    public dispatch(some: T): void {
        this._handlers.slice().forEach((handlerData: Signal.IHandlerData<T, any>) => {
            if (handlerData.isOnce) {
                this.off(handlerData.handler);
            }
            handlerData.handler.call(handlerData.context, some);
        });
    }

}

export module Signal {

    export interface IHandler<T, R> {
        (this: R, data: T): any;
    }

    export interface IHandlerData<T, R> {
        isOnce: boolean;
        handler: IHandler<T, R>;
        context: R;
        receiver: IReceiver;
    }

}
