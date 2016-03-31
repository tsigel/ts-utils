///<reference path="../typings/tsd.d.ts"/>
///<reference path="../dist/utils.d.ts"/>


import interfaceElement = ts.ScriptElementKind.interfaceElement;
describe('filters', () => {
    
    describe('not', () => {
        
        it('with processor', () => {
            
            let filter = utils.filters.not((data: any) => {
                if (data === 5) {
                    return false;
                }
                return !!data;
            });
            
            expect(filter(0)).to.be(true);
            expect(filter('')).to.be(true);
            expect(filter(5)).to.be(true);
            expect(filter(1)).to.be(false);
            expect(filter('5')).to.be(false);
            expect(filter('1')).to.be(false);
            
        });
        
        it('without processor', () => {
            
            let filter = utils.filters.not();
            
            expect(filter(0)).to.be(true);
            expect(filter('')).to.be(true);
            expect(filter(1)).to.be(false);
            expect(filter({})).to.be(false);
            
        });
        
    });
    
    describe('empty', () => {
        
        let map = {
            'without options': null,
            'with empty options': {},
            'with some options (not interface)': {
                id: 1,
                skip: 1,
                skipTrololo: []
            }
        };
        
        Object.keys(map).forEach((name: string) => {

            it(name, () => {
                
                let filter;
                if (map[name]) {
                    filter = utils.filters.empty(map[name]);
                } else {
                    filter = utils.filters.empty();
                }

                expect(filter(0)).to.be(false);
                expect(filter('')).to.be(false);
                expect(filter(1)).to.be(true);
                expect(filter('1')).to.be(true);
                expect(filter({})).to.be(true);
                expect(filter([])).to.be(true);

            });
            
        });

        let forTest = [
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
        ];
        
        interface ITestData {
            key: string;
            trueValue: Array<any>;
            falseValue: Array<any>;
        }
        
        forTest.forEach((testData: ITestData) => {

            it(`${testData.key}`, () => {

                let options = {};
                let keys = testData.key.split('|');

                keys.forEach((key: string) => {
                    options[key] = true;
                });

                let filter = utils.filters.empty(options);

                testData.trueValue.push([]);
                testData.trueValue.push({});

                let check = (value: any, target: boolean) => {
                    expect(filter(value)).to.be(target);
                    /* tslint:disable */
                    if (typeof value === 'string') {
                        expect(filter(new String(value))).to.be(true);
                    }
                    if (typeof value === 'number') {
                        expect(filter(new Number(value))).to.be(true);
                    }
                    /* tslint:enable */
                };

                testData.trueValue.forEach((value: any) => {
                    check(value, true);
                });

                testData.falseValue.forEach((value: any) => {
                    check(value, false);
                });
                
            });
            
        });
        
    });
    
});
