///<reference path="../typings/tsd.d.ts"/>
///<reference path="../dist/utils.d.ts"/>


describe('utils', () => {
    
    it('isObject', () => {
        
        expect(utils.isObject({})).to.be(true);
        expect(utils.isObject([])).to.be(false);
        expect(utils.isObject(null)).to.be(false);
        expect(utils.isObject(1)).to.be(false);
        
    });
    
    it('isEmpty', () => {
        
        expect(utils.isEmpty(null)).to.be(true);
        expect(utils.isEmpty(undefined)).to.be(true);
        expect(utils.isEmpty(0)).to.be(false);
        expect(utils.isEmpty('')).to.be(false);
        
    });

    it('isNumber', () => {

        expect(utils.isNumber(1)).to.be(true);
        expect(utils.isNumber(1)).to.be(true);
        /* tslint:disable */
        expect(utils.isNumber(new Number(1))).to.be(true);
        /* tslint:enable */
        expect(utils.isNumber('1')).to.be(false);

    });

    it('isString', () => {

        expect(utils.isString('1')).to.be(true);
        expect(utils.isString('')).to.be(true);
        /* tslint:disable */
        expect(utils.isString(new String('1'))).to.be(true);
        /* tslint:enable */
        expect(utils.isString(1)).to.be(false);

    });
    
    it('isArray', () => {

        expect(utils.isArray([])).to.be(true);
        expect(utils.isArray({})).to.be(false);
        
    });

    it('isNull', () => {

        expect(utils.isNull(null)).to.be(true);
        expect(utils.isNull(undefined)).to.be(false);
        expect(utils.isNull(0)).to.be(false);
        expect(utils.isNull('')).to.be(false);

    });

    it('isUndefined', () => {

        expect(utils.isUndefined(undefined)).to.be(true);
        expect(utils.isUndefined(null)).to.be(false);
        expect(utils.isUndefined(0)).to.be(false);
        expect(utils.isUndefined('')).to.be(false);

    });
    
    it('isNaN', () => {

        expect(utils.isNaN(NaN)).to.be(true);
        expect(utils.isNaN(null)).to.be(false);
        expect(utils.isNaN(0)).to.be(false);
        
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
