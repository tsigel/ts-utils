///<reference path="../typings/tsd.d.ts"/>
///<reference path="../dist/utils.d.ts"/>

/* tslint:disable */
new TestManager([
    {
        testName: 'utils',
        children: [
            {
                testName: 'isObject',
                testCallback: utils.isObject,
                trueValues: [{}, {a: 1}, new TestManager([])],
                falseValues: [null, 1, '1', new String('1'), new Number(1), [], undefined, utils.each]
            },
            {
                testName: 'isEmpty',
                testCallback: utils.isEmpty,
                trueValues: [null, undefined],
                falseValues: [{}, [], 0, '', new String('1'), new Number(1)]
            },
            {
                testName: 'isNotEmpty',
                testCallback: utils.isNotEmpty,
                trueValues: [{}, [], 0, '', new String('1'), new Number(1)],
                falseValues: [null, undefined]
            },
            {
                testName: 'isNumber',
                testCallback: utils.isNumber,
                trueValues: [0, NaN, new Number(0), new Number(NaN)],
                falseValues: ['0', {}, [], null, undefined]
            },
            {
                testName: 'isString',
                testCallback: utils.isString,
                trueValues: ['', new String(''), '1'],
                falseValues: [0, 1, {}, [], null, undefined]
            },
            {
                testName: 'isArray',
                testCallback: utils.isArray,
                trueValues: [[], new Array()],
                falseValues: [{}, 0, '', new String('1'), new Number(1)]
            },
            {
                testName: 'isNull',
                testCallback: utils.isNull,
                trueValues: [null],
                falseValues: [{}, 0, '', new String('1'), new Number(1), undefined]
            },
            {
                testName: 'isUndefined',
                testCallback: utils.isUndefined,
                trueValues: [undefined],
                falseValues: [{}, 0, '', new String('1'), new Number(1), null]
            },
            {
                testName: 'isNaN',
                testCallback: utils.isNaN,
                trueValues: [NaN, new Number(NaN)],
                falseValues: ['0', 0, new Number(0), {}, [], null, undefined]
            },
            {
                testName: 'isFunction',
                testCallback: utils.isFunction,
                trueValues: [new Function(), utils.each],
                falseValues: ['0', 0, new Number(0), {}, [], null, undefined]
            },
            {
                testName: 'find',
                children: [
                    {
                        testName: 'by Array',
                        testCallback: (data: any): any => {
                            return utils.find(data, {id: 1}) !== null;
                        },
                        trueValues: [[0, {id: 1}]],
                        falseValues: [[0,1,2]]
                    },
                    {
                        testName: 'by Object',
                        testCallback: (data: any): any => {
                            return utils.find(data, {id: 1}) !== null;
                        },
                        trueValues: [{a: {id: 2}, b: {id: 1}}],
                        falseValues: [{a: {id: 2}, b: {id: 3}}]
                    },
                    {
                        testName: 'with custom filter',
                        testCallback: (data: any): any => {
                            return utils.find(data, (some: any) => {
                                return some.id === 2;
                            }) !== null;
                        },
                        trueValues: [[{}, {id: 2}], {a: {id: 2}, b: {id: 1}}],
                        falseValues: [[{}, {id: 1}], {a: {id: 3}, b: {id: 1}}]
                    }
                ]
            },
            {
                testName: 'round',
                children: [
                    {
                        testName: 'with len',
                        testCallback: (data: number) => {
                            return utils.round(data, 3) === 2.333;
                        },
                        trueValues: [2.333333, 2.3329],
                        falseValues: [2.3, 2.3339]
                    },
                    {
                        testName: 'without len',
                        testCallback: (data: number) => {
                            return utils.round(data) === 2.33;
                        },
                        trueValues: [2.333333, 2.329],
                        falseValues: [2.3, 2.339]
                    }
                ]
            },
            {
                testName: 'splitRange',
                children: [
                    {
                        testName: 'with options',
                        children: [
                            {
                                testName: 'with separator',
                                testCallback: (data: number) => {
                                    return utils.splitRange(data, {separator: ','}) === '1 000,1';
                                },
                                trueValues: [1000.1]
                            },
                            {
                                testName: 'with nbsp',
                                testCallback: (data: number) => {
                                    return utils.splitRange(data, {nbsp: true}) === '1&nbsp;000.1';
                                },
                                trueValues: [1000.1]
                            },
                            {
                                testName: 'empty options',
                                testCallback: (data: number) => {
                                    return utils.splitRange(data, {}) === '1 000 000';
                                },
                                trueValues: [1000000]
                            }
                        ],
                    },
                    {
                        testName: 'with processor',
                        testCallback: (data: number) => {
                            return utils.splitRange(data, null, (data: number) => utils.round(data, 1)) === '1 000.1';
                        },
                        trueValues: [1000.11, 1000.1, 1000.111]
                    },
                    {
                        testName: 'only number',
                        testCallback: (data: number) => utils.splitRange(data) === '1 000',
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
       
        expect(utils.numToLength(1, 2)).to.be('01');
        expect(utils.numToLength(12, 2)).to.be('12');
        
    });
    
    it('some', () => {
        
        let data = {
            a: 1,
            b: 2
        };
        
        expect(utils.some(data, (value: any, key: string) => value === 2 && key === 'b')).to.be(true);
        
    });
    
    describe('each', () => {
        
        let data = {
            a: 1,
            b: 2
        };
        
        it('with context', () => {
            
            let result = {};
            let context = {};
            
            utils.each(data, function (some: any, key: string): void {
                if (this !== context) {
                    throw new Error('Wrong context!');
                }
                result[key] = some;
            }, context);
            
            expect(JSON.stringify(result)).to.be(JSON.stringify(data));
            
        });

        it('without context', () => {

            let result = {};
            
            utils.each(data, function (some: any, key: string): void {
                result[key] = some;
            });

            expect(JSON.stringify(result)).to.be(JSON.stringify(data));
            
        });
        
        it('empty call', () => {
            
            let ok = true;
            let callback = () => (ok = false);
            
            utils.each(null, callback);
            expect(ok).to.be(true);
            
        });
        
    });
    
});
