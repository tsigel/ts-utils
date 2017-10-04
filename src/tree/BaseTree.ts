import { ITreeData, ITreeOptions } from './interface';
import { Tree } from './Tree';
import { cloneDeep } from '../utils';

export class BaseTree<T> {

    public id: string | number;
    protected children: Array<BaseTree<T>>;
    protected parent: BaseTree<T> | Tree<T>;
    protected data: T;
    protected ChildConstructor: typeof BaseTree;


    constructor(data: ITreeData<T>, parent?: BaseTree<T> | Tree<T>, options?: ITreeOptions) {
        this.children = [];
        this.parent = parent;
        this.id = data.id;
        this.data = cloneDeep(data.data);
        this.ChildConstructor = options && options.Child || BaseTree;

        this.getRoot().registerChild(this);

        if (data.children) {
            data.children.forEach((item) => {
                this.children.push(new this.ChildConstructor(item, this, options));
            });
        }
    }

    public set<K extends keyof T>(key: K, value: T[K]): void {
        this.data[key] = value;
    }

    public get<K extends keyof T>(key: K): T[K] {
        if (this.data) {
            return this.data[key];
        }
    }

    public getExtended<K extends keyof T>(key: K): T[K] {
        const result = this.get(key);
        return result == null ? this.parent.getExtended(key) : result;
    }

    public getParent(): BaseTree<T> | Tree<T> {
        return this.parent;
    }

    public getRoot(): Tree<T> {
        return this.parent.getRoot();
    }

}
