///<reference path="../typings/tsd.d.ts"/>
///<reference path="../dist/utils.d.ts"/>


describe('filters', () => {
    
    describe('not', () => {
        
        it('with processor', () => {
            
            let filter = utils.filters.not((data: any) => {
                if (data === 5) return false;
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
    
});
