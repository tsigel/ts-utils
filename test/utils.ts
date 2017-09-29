import * as expect from 'expect.js';
import { TestManager } from './TestManager';
import {
    clone, cloneDeep,
    each,
    get,
    getPaths,
    isArray,
    isEmpty,
    isFunction,
    isNaNCheck,
    isNotEmpty,
    isNull,
    isNumber,
    isObject,
    isString,
    isUndefined,
    merge,
    numToLength,
    result,
    round,
    set,
    some,
    splitRange,
    typeOf
} from '../src/utils';
import { find } from '../src/utilsWithFilters';


/* tslint:disable */
new TestManager([
    {
        testName: 'utils',
        children: [
            {
                testName: 'isObject',
                testCallback: isObject,
                trueValues: [{}, { a: 1 }, new TestManager([])],
                falseValues: [null, 1, '1', new String('1'), new Number(1), [], undefined, each]
            },
            {
                testName: 'isEmpty',
                testCallback: isEmpty,
                trueValues: [null, undefined],
                falseValues: [{}, [], 0, '', new String('1'), new Number(1)]
            },
            {
                testName: 'isNotEmpty',
                testCallback: isNotEmpty,
                trueValues: [{}, [], 0, '', new String('1'), new Number(1)],
                falseValues: [null, undefined]
            },
            {
                testName: 'isNumber',
                testCallback: isNumber,
                trueValues: [0, NaN, new Number(0), new Number(NaN)],
                falseValues: ['0', {}, [], null, undefined]
            },
            {
                testName: 'isString',
                testCallback: isString,
                trueValues: ['', new String(''), '1'],
                falseValues: [0, 1, {}, [], null, undefined]
            },
            {
                testName: 'isArray',
                testCallback: isArray,
                trueValues: [[], new Array()],
                falseValues: [{}, 0, '', new String('1'), new Number(1)]
            },
            {
                testName: 'isNull',
                testCallback: isNull,
                trueValues: [null],
                falseValues: [{}, 0, '', new String('1'), new Number(1), undefined]
            },
            {
                testName: 'isUndefined',
                testCallback: isUndefined,
                trueValues: [undefined],
                falseValues: [{}, 0, '', new String('1'), new Number(1), null]
            },
            {
                testName: 'isNaNCheck',
                testCallback: isNaNCheck,
                trueValues: [NaN, new Number(NaN)],
                falseValues: ['0', 0, new Number(0), {}, [], null, undefined]
            },
            {
                testName: 'isFunction',
                testCallback: isFunction,
                trueValues: [new Function(), each],
                falseValues: ['0', 0, new Number(0), {}, [], null, undefined]
            },
            {
                testName: 'find',
                children: [
                    {
                        testName: 'by Array',
                        testCallback: (data: any): any => {
                            return find(data, { id: 1 }) !== null;
                        },
                        trueValues: [[0, { id: 1 }]],
                        falseValues: [[0, 1, 2]]
                    },
                    {
                        testName: 'by Object',
                        testCallback: (data: any): any => {
                            return find(data, { id: 1 }) !== null;
                        },
                        trueValues: [{ a: { id: 2 }, b: { id: 1 } }],
                        falseValues: [{ a: { id: 2 }, b: { id: 3 } }]
                    },
                    {
                        testName: 'with custom filter',
                        testCallback: (data: any): any => {
                            return find(data, (some: any) => {
                                return some.id === 2;
                            }) !== null;
                        },
                        trueValues: [[{}, { id: 2 }], { a: { id: 2 }, b: { id: 1 } }],
                        falseValues: [[{}, { id: 1 }], { a: { id: 3 }, b: { id: 1 } }]
                    }
                ]
            },
            {
                testName: 'roundFilter',
                children: [
                    {
                        testName: 'with len',
                        testCallback: (data: number) => {
                            return round(data, 3) === 2.333;
                        },
                        trueValues: [2.333333, 2.3329],
                        falseValues: [2.3, 2.3339]
                    },
                    {
                        testName: 'without len',
                        testCallback: (data: number) => {
                            return round(data) === 2.33;
                        },
                        trueValues: [2.333333, 2.329],
                        falseValues: [2.3, 2.339]
                    }
                ]
            },
            {
                testName: 'splitRangeFilter',
                children: [
                    {
                        testName: 'with options',
                        children: [
                            {
                                testName: 'with separator',
                                testCallback: (data: number) => {
                                    return splitRange(data, { separator: ',' }) === '1 000,1';
                                },
                                trueValues: [1000.1]
                            },
                            {
                                testName: 'with nbsp',
                                testCallback: (data: number) => {
                                    return splitRange(data, { nbsp: true }) === '1&nbsp;000.1';
                                },
                                trueValues: [1000.1]
                            },
                            {
                                testName: 'empty options',
                                testCallback: (data: number) => {
                                    return splitRange(data, {}) === '1 000 000';
                                },
                                trueValues: [1000000]
                            }
                        ],
                    },
                    {
                        testName: 'with processor',
                        testCallback: (data: number) => {
                            return splitRange(data, null, (data: number) => round(data, 1)) === '1 000.1';
                        },
                        trueValues: [1000.11, 1000.1, 1000.111]
                    },
                    {
                        testName: 'only number',
                        testCallback: (data: number) => splitRange(data) === '1 000',
                        trueValues: [1000]
                    }
                ]
            }
        ]
    }
]);
/* tslint:enable */

describe('utils', () => {

    it('numToLength', () => {

        expect(numToLength(1, 2)).to.be('01');
        expect(numToLength(12, 2)).to.be('12');

    });

    it('some', () => {

        let data = {
            a: 1,
            b: 2
        };

        expect(some(data, (value: any, key: string) => value === 2 && key === 'b')).to.be(true);
    });

    it('get', () => {
        const data = { a: { b: { c: [1] } } };
        expect(get(data, 'a.b.c')).to.be(data.a.b.c);
        expect(get(data, 'a.b.c[0]')).to.be(data.a.b.c[0]);
        expect(get(data, 'a.b.c.0')).to.be(data.a.b.c[0]);
        expect(get(data, '')).to.be(null);
        expect(get(data, 'a.b.d')).to.be(null);
        expect(get(data, 'a.e.k')).to.be(null);
        const data2 = { a: 1 };
        expect(get(data2, 'a.v')).to.be(null);
    });

    it('set', () => {
        const data: any = {};
        set(data, 'a.b.c', 1);
        expect(data.a.b.c).to.be(1);
        set(data, 'a.b.c', 2);
        expect(data.a.b.c).to.be(2);
        set(data, 'a.b.c[0]', 3);
        expect(data.a.b.c[0]).to.be(3);
    });

    it('result', () => {
        expect(result(() => 5)).to.be(result(5));
    });

    it('getPaths', () => {
        const data = {
            a: {
                b: 1,
                c: {
                    d: 2
                }
            },
            e: 3,
            j: [{ a: 1 }]
        };
        const paths = getPaths(data);
        expect(paths.map(String)).to.eql(['a.b', 'a.c.d', 'e', 'j[0].a']);
        const arrPaths = getPaths([{ a: 1 }]);
        expect(arrPaths.map(String)).to.eql(['[0].a']);
    });

    it('clone', () => {
        [
            1, '1', new Function(), true, null, undefined
        ].forEach((item) => {
            expect(clone(item)).to.be(item);
        });
        const arr = [];
        expect(clone(arr)).not.be.equal(arr);
        expect(clone(arr)).to.be.eql(arr);
        const obj = Object.create(null);
        expect(clone(obj)).not.be.equal(obj);
        expect(clone(obj)).to.be.eql(obj);
        const data = { a: {} };
        expect(clone(data)).not.be.equal(data);
        expect(clone(data).a).to.be(data.a);
    });

    it('merge', () => {
        const merged = merge<any>({ a: 1, arr: [{ a: 1 }] }, { b: 2 }, { c: 3 }, { arr: [{ b: 2 }] });
        expect(merged).to.be.eql({ a: 1, b: 2, c: 3, arr: [{ a: 1, b: 2 }] });
    });

    it('cloneDeep', () => {
        const data = { a: 1, b: 2, c: 3, arr: [{ a: 1, b: 2 }] };
        expect(cloneDeep(data)).to.be.eql(data);
        expect(cloneDeep(data)).not.be.equal(data);
        const obj = Object.create(null);
        expect(cloneDeep(obj)).not.be.equal(obj);
        expect(cloneDeep(obj)).not.be.equal(null);
        expect(cloneDeep(obj)).to.be.eql(obj);
    });

    it('typeOf', () => {
        expect(typeOf(null)).to.be('null');
        expect(typeOf({})).to.be('object');
        expect(typeOf([])).to.be('array');
        expect(typeOf(new Number(1))).to.be('number');
        expect(typeOf(new String(1))).to.be('string');
        expect(typeOf('')).to.be('string');
        expect(typeOf(true)).to.be('boolean');
        expect(typeOf(new Boolean(true))).to.be('boolean');
        expect(typeOf(undefined)).to.be('undefined');
        expect(typeOf((() => ({})))).to.be('function');
    });

    describe('each', () => {

        let data = {
            a: 1,
            b: 2
        };

        it('with context', () => {
            let res = {};
            let context = {};

            each(data, function (param: any, key: string): void {
                if (this !== context) {
                    throw new Error('Wrong context!');
                }
                res[key] = param;
            }, context);

            expect(JSON.stringify(res)).to.be(JSON.stringify(data));

        });

        it('without context', () => {
            let res = {};

            each(data, function (param: any, key: string): void {
                res[key] = param;
            });

            expect(JSON.stringify(res)).to.be(JSON.stringify(data));
        });

        it('empty call', () => {
            let ok = true;
            let callback = () => (ok = false);

            each(null, callback);
            expect(ok).to.be(true);
        });

        it('by array', () => {
            let ok = 0;
            const localData = [1, 2];
            each(localData, function (value: number, index: number): void {
                ok++;
                expect(value).to.be(localData[index]);
            });
            expect(ok).to.be(2);
        });

    });

});
