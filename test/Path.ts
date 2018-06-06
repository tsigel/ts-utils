import expect = require('expect.js');
import {Path} from '../src/Path';
import {isArray, isObject} from '../src/utils';


describe('Path', () => {

    describe('Parse path from string', () => {

        it('Simple path', () => {

            const path = Path.parse('a.b');
            const iterator = path.iterator();
            const a = iterator.next();
            const b = iterator.next();
            const empty = iterator.next();
            expect(a.value.name).to.be.eql('a');
            expect(isObject(a.value.container)).to.be(true);
            expect(b.value.name).to.be.eql('b');
            expect(isObject(b.value.container)).to.be(true);
            expect(empty.done).to.be(true);
            expect(empty.value).to.be(undefined);
        });

        it('Path with array', () => {
            const path = Path.parse('a.b[0]');
            const iterator = path.iterator();
            const a = iterator.next();
            const b = iterator.next();
            const arr = iterator.next();
            expect(a.value.name).to.be.eql('a');
            expect(isObject(a.value.container)).to.be(true);
            expect(b.value.name).to.be.eql('b');
            expect(isObject(b.value.container)).to.be(true);
            expect(arr.value.name).to.be(0);
            expect(isArray(arr.value.container)).to.be(true);
        });

        it('Path with array with array', () => {
            const path = Path.parse('a.b[0][0]');
            const iterator = path.iterator();
            const a = iterator.next();
            const b = iterator.next();
            const arr1 = iterator.next();
            const arr2 = iterator.next();
            expect(a.value.name).to.be.eql('a');
            expect(isObject(a.value.container)).to.be(true);
            expect(b.value.name).to.be.eql('b');
            expect(isObject(b.value.container)).to.be(true);
            expect(arr1.value.name).to.be(0);
            expect(isArray(arr1.value.container)).to.be(true);
            expect(arr2.value.name).to.be(0);
            expect(isArray(arr2.value.container)).to.be(true);
        });
    });

});
