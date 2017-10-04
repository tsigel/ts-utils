import expect = require('expect.js');
import { Tree } from '../src/tree/Tree';

const TREE = [
    {
        id: 'welcome',
        url: '/',
        data: {
            noLogin: true,
            viewName: 'main'
        },
        children: [
            {
                id: 'get_started',
                data: {
                    noLogin: true
                }
            }
        ]
    },
    {
        id: 'main',
        data: {
            abstract: true,
            viewName: 'main',
        },
        children: [
            {
                id: 'wallet',
                data: {
                    redirectTo: 'main.wallet.assets',
                    viewName: 'mainContent'
                },
                children: [
                    { id: 'assets' },
                    { id: 'portfolio' }
                ]
            },
            {
                id: 'dex',
                data: {
                    viewName: 'mainContent'
                }
            }
        ]
    }
];

interface IItemData {
    url?: string;
    viewName?: string;
    abstract?: boolean;
    redirectTo?: string;
    noLogin?: boolean;
}

describe('Tree', () => {

    let tree: Tree<IItemData>;

    beforeEach(() => {
        tree = new Tree({ id: 'root', children: TREE });
    });

    it('create', () => {
        expect(tree instanceof Tree).to.be(true);
    });

    it('find', () => {
        const result = tree.find('wallet');
        expect(result == null).to.be(false);
        expect(result.id).to.be('wallet');
        expect(result.get('redirectTo')).to.be('main.wallet.assets');
    });

    it('get', () => {
        const assets = tree.find('assets');
        expect(assets.get('viewName')).to.be(undefined);
        const wallet = tree.find('wallet');
        expect(wallet.get('viewName')).to.be('mainContent');
    });

    it('getExtended', () => {
        const assets = tree.find('assets');
        expect(assets.getExtended('viewName')).to.be('mainContent');
        const wallet = tree.find('wallet');
        expect(wallet.getExtended('viewName')).to.be('mainContent');
    });

    it('getPath', () => {
        const path = tree.getPath('assets');
        expect(path).to.be.eql(['main', 'wallet', 'assets']);
    });

    it('getChildren', () => {
        const children = tree.find('wallet').getChildren();
        expect(children.length).to.be(2);
    });

    it('toArray', () => {
        const array = tree.toArray().map(item => item.id);
        expect(array).to.be.eql([
            'root',
            'welcome',
            'get_started',
            'main',
            'wallet',
            'assets',
            'portfolio',
            'dex'
        ]);
    });

    it('where', () => {
        const noLoginList = tree.where({ noLogin: true });
        expect(noLoginList.length).to.be(2);
        expect(noLoginList.map(i => i.id)).to.be.eql(['welcome', 'get_started']);
    });

});
