import { BaseTree } from './BaseTree';
import { IHash } from '../utils';
import { ITreeData, ITreeOptions } from './interface';
import { contains, containsDeep } from '../filters';

export class Tree<T> extends BaseTree<T> {

    private _childHash: IHash<BaseTree<T>>;


    constructor(data: ITreeData<T>, options?: ITreeOptions) {
        super(data, null, options);
    }

    public where(data: Partial<T>): Array<BaseTree<T>> {
        const filter = typeof data === 'object' ? containsDeep(data) : contains(data);
        return Object.keys(this._childHash).reduce((result, item, i) => {
            if (filter(this._childHash[item].getData() as any)) {
                result.push(this._childHash[item]);
            }
            return result;
        }, []);
    }

    public registerChild(child: BaseTree<T>): void {
        if (!this._childHash) {
            this._childHash = Object.create(null);
        }

        if (child !== this) {
            if (this._childHash[child.id]) {
                throw new Error('Duplicate ID');
            } else {
                this._childHash[child.id] = child;
            }
        }
    }

    public getPath(id): Array<string | number> | void {
        const item = this.find(id);
        if (!item) {
            return null;
        }
        const result = [];
        let tmp = item;
        do {
            result.push(tmp.id);
            tmp = tmp.getParent();
        } while (tmp.getParent());
        return result.reverse();
    }

    public getRoot() {
        return this;
    }

    public find(id: string | number) {
        return this._childHash[id];
    }
}
