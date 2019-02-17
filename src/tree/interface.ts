import { BaseTree } from './BaseTree';


export type TID = string | number;

export interface ITreeData<T> {
    children?: Array<ITreeData<T>>;
    id: TID;
    data?: T;
}

export interface ITreeOptions<T> {
    Child: ITreeConstructor<T>;
}

export interface ITreeConstructor<T> {
    new(data: ITreeData<T>, parent: BaseTree<T>, options: ITreeOptions<T>): BaseTree<T>;
}
