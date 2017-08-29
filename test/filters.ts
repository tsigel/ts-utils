import * as expect from 'expect.js';
import { TestManager } from './TestManager';
import {
    contains,
    containsDeep,
    date as dateFilter,
    empty,
    equal,
    not,
    notContains,
    notContainsDeep,
    notEqual,
    roundFilter,
    roundSplit,
    splitRangeFilter
} from '../src/filters';
import { round } from '../src/utils';


/* tslint:disable */
new TestManager([
    {
        testName: 'filters',
        children: [
            {
                testName: 'not',
                children: [
                    {
                        testName: 'with processor',
                        testCallback: not((data: any) => {
                            if (data === 5) {
                                return false;
                            }
                            return !!data;
                        }),
                        trueValues: [0, '', 5],
                        falseValues: [1, '5', '1']
                    },
                    {
                        testName: 'without processor',
                        testCallback: not(),
                        trueValues: [0, ''],
                        falseValues: [1, '1', {}, []]
                    }
                ]
            },
            {
                testName: 'empty',
                children: [
                    {
                        testName: 'without options',
                        testCallback: empty(),
                        trueValues: [1, {}, [], '1'],
                        falseValues: [0, '', null, undefined]
                    },
                    {
                        testName: 'with empty options',
                        testCallback: empty({}),
                        trueValues: [1, {}, [], '1'],
                        falseValues: [0, '', null, undefined]
                    },
                    {
                        testName: 'with some options (not interface)',
                        testCallback: empty(<any>{
                            id: 1,
                            skip: 1,
                            skipTrololo: []
                        }),
                        trueValues: [1, {}, [], '1'],
                        falseValues: [0, '', null, undefined]
                    }
                ].concat([
                    {
                        key: 'skipNotEmpty',
                        trueValue: [0, ''],
                        falseValue: [null, undefined]
                    },
                    {
                        key: 'skipNumber',
                        trueValue: [0, NaN],
                        falseValue: [null, '', undefined]
                    },
                    {
                        key: 'skipString',
                        trueValue: [''],
                        falseValue: [null, undefined, 0]
                    },
                    {
                        key: 'skipNull',
                        trueValue: [null],
                        falseValue: [undefined, 0, '']
                    },
                    {
                        key: 'skipUndefined',
                        trueValue: [undefined],
                        falseValue: [null, 0, '']
                    },
                    {
                        key: 'skipNumber|skipString',
                        trueValue: [0, ''],
                        falseValue: [null, undefined]
                    },
                    {
                        key: 'skipNull|skipUndefined',
                        trueValue: [null, undefined],
                        falseValue: [0, '']
                    },
                    {
                        key: 'skipNull|skipUndefined|skipString',
                        trueValue: [null, undefined, ''],
                        falseValue: [0]
                    },
                    {
                        key: 'skipNull|skipUndefined|skipNumber',
                        trueValue: [null, undefined, 0],
                        falseValue: ['']
                    }
                ].map((forTest: any) => {
                    const options = {};
                    forTest.key.split('|').forEach((optionName: string) => {
                        options[optionName] = true;
                    });
                    return {
                        testName: forTest.key,
                        testCallback: empty(options),
                        trueValues: forTest.trueValue,
                        falseValues: forTest.falseValue
                    };
                }))
            },
            {
                testName: 'contains',
                testCallback: contains({ id: 1, a: 1 }),
                trueValues: [{ id: 1, a: 1 }],
                falseValues: [1, 0, null, undefined, {}, [], { id: 1 }, { id: 1, a: 2 }]
            },
            {
                testName: 'containsDeep',
                children: [
                    {
                        testName: 'one level',
                        testCallback: containsDeep({ id: 1, a: 1 }),
                        trueValues: [{ id: 1, a: 1 }],
                        falseValues: [1, 0, null, undefined, {}, [], { id: 1 }, { id: 1, a: 2 }]
                    },
                    {
                        testName: 'two level',
                        testCallback: containsDeep({ a: { b: 1 } }),
                        trueValues: [{ a: { b: 1 } }],
                        falseValues: [1, 0, null, undefined, {}, [], { a: 1 }, { a: {} }, { a: { b: 2 } }]
                    }
                ]
            },
            {
                testName: 'notContains',
                testCallback: notContains({ id: 1, a: 1 }),
                trueValues: [1, 0, null, undefined, {}, [], { id: 1 }, { id: 1, a: 2 }],
                falseValues: [{ id: 1, a: 1 }]
            },
            {
                testName: 'notContainsDeep',
                children: [
                    {
                        testName: 'one level',
                        testCallback: notContainsDeep({ id: 1, a: 1 }),
                        trueValues: [1, 0, null, undefined, {}, [], { id: 1 }, { id: 1, a: 2 }],
                        falseValues: [{ id: 1, a: 1 }]
                    },
                    {
                        testName: 'two level',
                        testCallback: notContainsDeep({ a: { b: 1 } }),
                        trueValues: [1, 0, null, undefined, {}, [], { a: 1 }, { a: {} }, { a: { b: 2 } }],
                        falseValues: [{ a: { b: 1 } }]
                    }
                ]
            },
            {
                testName: 'equal',
                children: [
                    {
                        testName: 'noStrict',
                        testCallback: equal(10, true),
                        trueValues: [10, '10', { valueOf: (): number => 10 }],
                        falseValues: [9, '11', 11, {}, []]
                    },
                    {
                        testName: 'strict',
                        testCallback: equal(10),
                        trueValues: [10,],
                        falseValues: [9, '10', '11', 11, {}, [], { valueOf: (): number => 10 }]
                    }
                ]
            },
            {
                testName: 'notEqual',
                children: [
                    {
                        testName: 'noStrict',
                        testCallback: notEqual(10, true),
                        trueValues: [9, '11', 11, {}, []],
                        falseValues: [10, '10', { valueOf: (): number => 10 }]
                    },
                    {
                        testName: 'strict',
                        testCallback: notEqual(10),
                        trueValues: [9, '10', '11', 11, {}, [], { valueOf: (): number => 10 }],
                        falseValues: [10]
                    }
                ]
            },
            {
                testName: 'roundFilter',
                children: [
                    {
                        testName: 'with len',
                        testCallback: (num: number) => {
                            const filter = roundFilter(3);
                            return filter(num) === 1000.111;
                        },
                        trueValues: [1000.1111, 1000.1109]
                    },
                    {
                        testName: 'without len',
                        testCallback: (num: number) => {
                            const filter = roundFilter();
                            return filter(num) === 1000.11;
                        },
                        trueValues: [1000.1111, 1000.109]
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
                                    const filter = splitRangeFilter({ separator: ',' });
                                    return filter(data) === '1 000,1'
                                },
                                trueValues: [1000.1]
                            },
                            {
                                testName: 'with nbsp',
                                testCallback: (data: number) => {
                                    const filter = splitRangeFilter({ nbsp: true });
                                    return filter(data) === '1&nbsp;000.1'
                                },
                                trueValues: [1000.1]
                            },
                            {
                                testName: 'empty options',
                                testCallback: (data: number) => {
                                    const filter = splitRangeFilter({});
                                    return filter(data) === '1 000 000'
                                },
                                trueValues: [1000000]
                            }
                        ],
                    },
                    {
                        testName: 'with processor',
                        testCallback: (data: number) => {
                            const filter = splitRangeFilter(null, (data: number) => round(data, 1));
                            return filter(data) === '1 000.1'
                        },
                        trueValues: [1000.11, 1000.1, 1000.111]
                    },
                    {
                        testName: 'only number',
                        testCallback: (data: number) => {
                            const filter = splitRangeFilter();
                            return filter(data) === '1 000'
                        },
                        trueValues: [1000]
                    }
                ]
            },
            {
                testName: 'roundSplit',
                testCallback: (data: number) => {
                    const filter = roundSplit(3);
                    return filter(data) === '1 000.111';
                },
                trueValues: [1000.1111, 1000.1109, 1000.111]
            }
        ]
    }
]);
/* tslint:enable */

describe('filters', () => {

    const stamp = 1459603645801;
    const date = new Date(stamp);
    const pattern = 'YYYY YY MM M DD D hh h mm m ss s';
    const result = '2016 16 04 4 02 2 16 16 27 27 25 25';

    it('contains simple', () => {
        const arr = [1, 2, 3];
        expect(arr.filter(contains(1))).to.be.eql([1]);
    });

    describe('date', () => {

        it('without processor', () => {

            const filter = dateFilter(pattern);
            const myFilter = dateFilter('DD.MM.YYYY hh:mm:ss');

            expect(filter(stamp)).to.be(result);
            expect(filter(date)).to.be(result);
            expect(myFilter(stamp)).to.be('02.04.2016 16:27:25');

        });

        it('with processor', () => {

            const filter = dateFilter(pattern, (state: boolean) => {
                return state ? date : stamp;
            });

            expect(filter(1)).to.be(result);
            expect(filter(0)).to.be(result);

        });
    });

});
