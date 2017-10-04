import expect = require('expect.js');

export class TestManager {

    constructor(testData: Array<ITestData>) {

        testData.forEach(function iterate(data: ITestData): void {

            if (data.children) {
                describe(data.testName, () => {
                    data.children.forEach(iterate);
                });
            } else {
                it(data.testName, () => {
                    if (data.trueValues) {
                        data.trueValues.forEach((val: any) => {
                            expect(data.testCallback(val)).to.be(true);
                        });
                    }
                    if (data.falseValues) {
                        data.falseValues.forEach((val: any) => {
                            expect(data.testCallback(val)).to.be(false);
                        });
                    }
                });
            }

        });

    }

}

interface ITestData {
    testName: string;
    trueValues?: Array<any>;
    falseValues?: Array<any>;
    testCallback?: Function;
    children?: Array<ITestData>;
}
