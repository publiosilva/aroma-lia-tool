import { TestSmell, TestSwitchModel } from '../../domain/models';
import { DetectTestSmell } from '../../domain/usecases';

export class DetectDuplicateAssertTestSmellService implements DetectTestSmell {
  execute(testSwitch: TestSwitchModel): TestSmell[] {
    const testSmells: TestSmell[] = [];

    for (const test of testSwitch.tests) {
      const seenAssertionsKeys = new Set<string>();

      for (const assert of test.asserts) {
        const assertKey = `${assert.literalActual}-${assert.matcher}-${assert.literalExpected}`;

        if (seenAssertionsKeys.has(assertKey)) {
          testSmells.push({
            endLine: assert.endLine,
            name: 'DuplicateAssert',
            startLine: assert.startLine,
            test,
            testSwitch,
          });
        } else {
          seenAssertionsKeys.add(assertKey);
        }
      }
    }

    return testSmells;
  }
}
