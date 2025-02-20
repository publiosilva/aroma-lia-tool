import { TestSwitchModel, TestSmell, TestEventTypeModel } from '../../domain/models';
import { DetectTestSmell } from '../../domain/usecases';

export class DetectSleepyTestTestSmellService implements DetectTestSmell {
  execute(testSwitch: TestSwitchModel): TestSmell[] {
    const testSmells: TestSmell[] = [];

    for (const test of testSwitch.tests) {
      const sleepEvent = test.events.find(({ type }) => type === TestEventTypeModel.sleep);

      if (sleepEvent) {
        testSmells.push({
          endLine: sleepEvent.endLine,
          name: 'SleepyTest',
          startLine: sleepEvent.startLine,
          test,
          testSwitch,
        });
      }
    }

    return testSmells;
  }
}
