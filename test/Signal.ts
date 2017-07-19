import * as expect from 'expect.js';
import {Signal} from '../src/Signal';


describe('Signal', () => {

    let signal: Signal<number> = new Signal();
    
    it('create', () => {
        expect(signal instanceof Signal).to.be(true);
    });   
    
    it('on', () => {
        
        let ok = false;
        signal.on(() => {
            ok = true;
        });
        signal.dispatch(null);
        expect(ok).to.be(true);
        signal.off();
        
    });
    
    it('once', () => {

        let ok = false;
        let count = 0;
        signal.once(() => {
            count++;
            ok = count === 1;
        });
        signal.dispatch(null);
        signal.dispatch(null);
        expect(ok).to.be(true);
        signal.off();
        
    });

    describe('off', () => {
        
        it('by handler', () => {

            let ok = false;
            let count = 0;
            let handler = () => {
                count++;
                ok = count === 1;
            };
            signal.on(handler);
            signal.dispatch(null);
            signal.off(handler);
            signal.dispatch(null);
            expect(ok).to.be(true);
            signal.off();
            
        });

        it('all', () => {

            let ok = true;
            
            signal.on(() => {
                ok = false;
            });

            signal.on(() => {
                ok = false;
            });
            
            signal.off();
            signal.dispatch(null);
            expect(ok).to.be(true);

        });
        
    });
    
    it('dispatch', () => {
        
        let ok = false;
        signal.on((data: number) => {
            ok = data === 1;
        });
        signal.dispatch(1);
        expect(ok).to.be(true);
        signal.off();
        
    });
    
});
