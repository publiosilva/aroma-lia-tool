import { TestSmell, TestSwitchModel } from '../../domain/models';
import { DetectTestSmell } from '../../domain/usecases';


export class DetectAssertionRouletteTestSmellService implements DetectTestSmell {
  execute(testSwitch: TestSwitchModel): TestSmell[] {
    const testSmells: TestSmell[] = [];

    for (const test of testSwitch.tests) {
      if (test.asserts.length > 1) {
        for (const assert of test.asserts) {
          if (!assert.message) {
            testSmells.push({
              endLine: assert.endLine,
              name: 'AssertionRoulette',
              startLine: assert.startLine,
              test,
              testSwitch,
            });
          }
        }
      }
    }

    return testSmells;
  }
}
