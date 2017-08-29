export class Iterator<T> {

    private _list: ArrayLike<T>;
    private _step: number = 0;

    constructor(some: ArrayLike<T>) {
        this._list = some;
    }

    public next(): IArrayStep<T> {
        if (this._step < this._list.length) {
            const result = {
                done: false,
                value: this._list[this._step]
            };
            this._step++;
            return result;
        } else {
            return {
                done: true
            };
        }

    }
}

export interface IArrayStep<T> {
    done: boolean;
    value?: T;
}
