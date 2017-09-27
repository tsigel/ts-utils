import { Iterator } from './Iterator';


export const enum PATH_TYPE {
    Object,
    Array
}

export class Path {

    public length: number;
    private _path: Array<IPathItem>;


    constructor(path: Array<IPathItem>) {
        this._path = path;
        this.length = this._path.length;
    }

    public reverse(): Path {
        return new Path(this._path.slice().reverse());
    }

    public iterator(): Iterator<IPathData> {
        return new Iterator(this._path.map((item, index) => this.getItemData(index)));
    }

    public slice(start: number, end: number): Path {
        return new Path(this._path.slice(start, end));
    }

    public forEach(cb: (data: IPathData, index?: number) => any, context?: any): void {
        return this._path.forEach((item, index) => {
            cb.call(context, this.getItemData(index), index);
        });
    }

    public some(cb: (data: IPathData, index?: number) => any, context?: any): boolean {
        return this._path.some((item, index) => {
            return cb.call(context, this.getItemData(index), index);
        });
    }

    public toString(): string {
        return this._path.map((item, i) => {
            switch (item.type) {
                case PATH_TYPE.Object:
                    return i === 0 ? item.name : `.${item.name}`;
                case PATH_TYPE.Array:
                    return `[${item.name}]`;
            }
        }).join('');
    }

    public getItemData(index: number): IPathData {
        const container = Path.getContainer(this._path[index].type);
        const nextContainer = this._path[index + 1] && Path.getContainer(this._path[index + 1].type) || null;
        return { name: this._path[index].name, container, nextContainer };
    }

    public static parse(path: string): Path {
        const parts = [];
        path.split('.').forEach((key) => {
            if (key === '') {
                parts.push({
                    type: PATH_TYPE.Object,
                    key
                });
            } else {
                const [name, index] = key.replace(/\[(.*)?\]/, '|$1').split('|');
                if (name) {
                    const num = Number(name);
                    if (String(num) === name) {
                        parts.push({
                            type: PATH_TYPE.Array,
                            name
                        });
                    } else {
                        parts.push({
                            type: PATH_TYPE.Object,
                            name
                        });
                    }
                }
                if (index) {
                    parts.push({
                        type: PATH_TYPE.Array,
                        name: index
                    });
                }
            }
        });
        return new Path(parts);
    }

    private static getContainer(type: PATH_TYPE): Array<any> | object {
        switch (type) {
            case PATH_TYPE.Object:
                return Object.create(null);
            case PATH_TYPE.Array:
                return [];
        }
    }
}

export interface IPathItem {
    type: PATH_TYPE;
    name: string;
}

export interface IPathData {
    name: string;
    container: Array<any> | object;
    nextContainer?: Array<any> | object;
}
