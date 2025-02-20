import { TestSmell, TestSwitchModel } from '../../domain/models';
import { DetectTestSmell } from '../../domain/usecases';

export class DetectIgnoredTestTestSmellService implements DetectTestSmell {
  execute(testSwitch: TestSwitchModel): TestSmell[] {
    const testSmells: TestSmell[] = [];

    if (testSwitch.isIgnored) {
      for (const test of testSwitch.tests) {
        testSmells.push({
          endLine: test.endLine,
          name: 'IgnoredTest',
          startLine: test.startLine,
          test,
          testSwitch,
        });
      }

      return testSmells;
    }

    const exclusiveTests = testSwitch.tests.filter(test => test.isExclusive);

    if (exclusiveTests.length > 0) {
      for (const test of testSwitch.tests) {
        if (!test.isExclusive) {
          testSmells.push({
            name: 'IgnoredTest',
            test,
            testSwitch,
            startLine: test.startLine,
            endLine: test.endLine,
          });
        }
      }

      return testSmells;
    }

    for (const test of testSwitch.tests) {
      if (test.isIgnored) {
        testSmells.push({
          name: 'IgnoredTest',
          test,
          testSwitch,
          startLine: test.startLine,
          endLine: test.endLine,
        });
      }
    }

    return testSmells;
  }
}
