import { Receiver } from '../src/Receiver';
import { Signal } from '../src/Signal';
import * as expect from 'expect.js';

describe('Receiver', () => {

    let signal: Signal<void>;
    let receiver: Receiver;

    beforeEach(() => {
        signal = new Signal();
        receiver = new Receiver();
    });

    it('receive', () => {
        let ok = false;
        receiver.receive(signal, () => (ok = true));
        signal.dispatch(null);
        expect(ok).to.be(true);
    });

    it('receive once', () => {
        let ok = 0;
        receiver.receiveOnce(signal, () => (ok++));
        signal.dispatch(null);
        signal.dispatch(null);
        expect(ok).to.be(1);
    });

    describe('stop receive', () => {

        it('stop without handlers', () => {
            receiver.stopReceive();
        });

        it('all', () => {

            let count = 0;
            const signals = [new Signal(), new Signal(), new Signal()];

            signals.forEach((s) => {
                receiver.receive(s, () => (count++));
            });

            signals.forEach((s) => s.dispatch(null));
            receiver.stopReceive();
            signals.forEach((s) => s.dispatch(null));

            expect(count).to.be(3);
        });

        it('stop by signal', () => {

            let count = 0;

            const s1 = new Signal();
            const s2 = new Signal();
            const handler = () => (count++);

            receiver.receive(s1, handler);
            receiver.receive(s2, handler);

            s1.dispatch(null);
            s2.dispatch(null);

            receiver.stopReceive(s1);

            s1.dispatch(null);
            s2.dispatch(null);

            expect(count).to.be(3);
        });

        it('stop by handler', () => {

            let count = 0;

            const s1 = new Signal();
            const s2 = new Signal();
            const handler = () => (count++);

            receiver.receive(s1, handler);
            receiver.receive(s2, handler);

            s1.dispatch(null);
            s2.dispatch(null);

            receiver.stopReceive(handler);

            s1.dispatch(null);
            s2.dispatch(null);

            expect(count).to.be(2);
        });

        it('stop by handler and signal', () => {

            let count = 0;

            const h1 = () => (count++);
            const h2 = () => (count++);

            receiver.receive(signal, h1);
            receiver.receive(signal, h2);

            signal.dispatch(null);

            receiver.stopReceive(signal, h1);

            signal.dispatch(null);

            expect(count).to.be(3);
        });

    });

});
