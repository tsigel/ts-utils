///<reference path="../typings/tsd.d.ts"/>
///<reference path="../dist/utils.d.ts"/>

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
                        testCallback: utils.filters.not((data: any) => {
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
                        testCallback: utils.filters.not(),
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
                        testCallback: utils.filters.empty(),
                        trueValues: [1, {}, [], '1'],
                        falseValues: [0, '', null, undefined]
                    },
                    {
                        testName: 'with empty options',
                        testCallback: utils.filters.empty({}),
                        trueValues: [1, {}, [], '1'],
                        falseValues: [0, '', null, undefined]
                    },
                    {
                        testName: 'with some options (not interface)',
                        testCallback: utils.filters.empty(<any>{
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
                    let options = {};
                    forTest.key.split('|').forEach((optionName: string) => {
                        options[optionName] = true;
                    });
                    return {
                        testName: forTest.key,
                        testCallback: utils.filters.empty(options),
                        trueValues: forTest.trueValue,
                        falseValues: forTest.falseValue
                    };
                }))
            },
            {
                testName: 'contains',
                testCallback: utils.filters.contains({id: 1, a: 1}),
                trueValues: [{id: 1, a: 1}],
                falseValues: [1, 0, null, undefined, {}, [], {id: 1}, {id: 1, a: 2}]
            },
            {
                testName: 'containsDeep',
                children: [
                    {
                        testName: 'one level',
                        testCallback: utils.filters.containsDeep({id: 1, a: 1}),
                        trueValues: [{id: 1, a: 1}],
                        falseValues: [1, 0, null, undefined, {}, [], {id: 1}, {id: 1, a: 2}]
                    },
                    {
                        testName: 'two level',
                        testCallback: utils.filters.containsDeep({a: {b: 1}}),
                        trueValues: [{a: {b: 1}}],
                        falseValues: [1, 0, null, undefined, {}, [], {a: 1}, {a: {}}, {a: {b: 2}}]
                    }
                ]
            },
            {
                testName: 'notContains',
                testCallback: utils.filters.notContains({id: 1, a: 1}),
                trueValues: [1, 0, null, undefined, {}, [], {id: 1}, {id: 1, a: 2}],
                falseValues: [{id: 1, a: 1}]
            },
            {
                testName: 'notContainsDeep',
                children: [
                    {
                        testName: 'one level',
                        testCallback: utils.filters.notContainsDeep({id: 1, a: 1}),
                        trueValues: [1, 0, null, undefined, {}, [], {id: 1}, {id: 1, a: 2}],
                        falseValues: [{id: 1, a: 1}]
                    },
                    {
                        testName: 'two level',
                        testCallback: utils.filters.notContainsDeep({a: {b: 1}}),
                        trueValues: [1, 0, null, undefined, {}, [], {a: 1}, {a: {}}, {a: {b: 2}}],
                        falseValues: [{a: {b: 1}}]
                    }
                ]
            },
            {
                testName: 'equal',
                children: [
                    {
                        testName: 'noStrict',
                        testCallback: utils.filters.equal(10, true),
                        trueValues: [10, '10', {valueOf: (): number => 10}],
                        falseValues: [9, '11', 11, {}, []]
                    },
                    {
                        testName: 'strict',
                        testCallback: utils.filters.equal(10),
                        trueValues: [10,],
                        falseValues: [9, '10', '11', 11, {}, [], {valueOf: (): number => 10}]
                    }
                ]
            },
            {
                testName: 'notEqual',
                children: [
                    {
                        testName: 'noStrict',
                        testCallback: utils.filters.notEqual(10, true),
                        trueValues: [9, '11', 11, {}, []],
                        falseValues: [10, '10', {valueOf: (): number => 10}]
                    },
                    {
                        testName: 'strict',
                        testCallback: utils.filters.notEqual(10),
                        trueValues: [9, '10', '11', 11, {}, [], {valueOf: (): number => 10}],
                        falseValues: [10]
                    }
                ]
            }
        ]
    }
]);
/* tslint:enable */

describe('filters', () => {

    let stamp = 1459603645801;
    let date = new Date(stamp);
    let pattern = 'YYYY YY MM M DD D hh h mm m ss s';
    let result = '2016 16 04 4 02 2 16 16 27 27 25 25';

    describe('date', () => {
        
        it('without processor', () => {

            let filter = utils.filters.date(pattern);
            let myFilter = utils.filters.date('DD.MM.YYYY hh:mm:ss');

            expect(filter(stamp)).to.be(result);
            expect(filter(date)).to.be(result);
            expect(myFilter(stamp)).to.be('02.04.2016 16:27:25');

        });
        
        it('with processor', () => {
            
            let filter = utils.filters.date(pattern, (state: boolean) => {
                return state ? date : stamp;
            });

            expect(filter(1)).to.be(result);
            expect(filter(0)).to.be(result);
            
        });
    });

});
