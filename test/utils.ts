import * as expect from 'expect.js';
import {TestManager} from './TestManager';
import {
    each, isArray, isEmpty, isFunction, isNotEmpty, isNull, isNumber, isObject, isString, isUndefined, numToLength,
    round, some, splitRange, isNaNCheck, get, set, result, getPaths
} from '../src/utils';
import {find} from '../src/utilsWithFilters';


/* tslint:disable */
new TestManager([
    {
        testName: 'utils',
        children: [
            {
                testName: 'isObject',
                testCallback: isObject,
                trueValues: [{}, {a: 1}, new TestManager([])],
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
                            return find(data, {id: 1}) !== null;
                        },
                        trueValues: [[0, {id: 1}]],
                        falseValues: [[0,1,2]]
                    },
                    {
                        testName: 'by Object',
                        testCallback: (data: any): any => {
                            return find(data, {id: 1}) !== null;
                        },
                        trueValues: [{a: {id: 2}, b: {id: 1}}],
                        falseValues: [{a: {id: 2}, b: {id: 3}}]
                    },
                    {
                        testName: 'with custom filter',
                        testCallback: (data: any): any => {
                            return find(data, (some: any) => {
                                return some.id === 2;
                            }) !== null;
                        },
                        trueValues: [[{}, {id: 2}], {a: {id: 2}, b: {id: 1}}],
                        falseValues: [[{}, {id: 1}], {a: {id: 3}, b: {id: 1}}]
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
                                    return splitRange(data, {separator: ','}) === '1 000,1';
                                },
                                trueValues: [1000.1]
                            },
                            {
                                testName: 'with nbsp',
                                testCallback: (data: number) => {
                                    return splitRange(data, {nbsp: true}) === '1&nbsp;000.1';
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
        const data = {a: {b: {c: {}}}};
        expect(get(data, 'a.b.c')).to.be(data.a.b.c);
        expect(get(data, '')).to.be(null);
        expect(get(data, 'a.b.d')).to.be(null);
        expect(get(data, 'a.e.k')).to.be(null);
        const data2 = {a: 1};
        expect(get(data2, 'a.v')).to.be(null);
    });

    it('set', () => {
        const data: any = {};
        set(data, 'a.b.c', 1);
        expect(data.a.b.c).to.be(1);
        set(data, 'a.b.c', 2);
        expect(data.a.b.c).to.be(2);
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
            e: 3
        };
        const paths = getPaths(data);
        expect(paths).to.eql([['a', 'b'], ['a', 'c', 'd'], ['e']]);
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
        
    });
    
});
