import expect = require('expect.js');
import { Signal } from '../src/Signal';


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

    });

    describe('off', () => {

        it('by handler', () => {

            let ok = false;
            let count = 0;
            let h1 = () => {
                count++;
                ok = count === 1;
            };
            let h2 = () => {
                count++;
            };
            signal.on(h1);
            signal.on(h2);
            signal.on(h2);
            signal.dispatch(null);
            signal.off(h1);
            signal.dispatch(null);
            signal.off(h2);
            expect(ok).to.be(true);
            expect(count).to.be(5);

        });

    });

    it('dispatch', () => {

        let ok = false;
        signal.on((data: number) => {
            ok = data === 1;
        });
        signal.dispatch(1);
        expect(ok).to.be(true);
    });

});
