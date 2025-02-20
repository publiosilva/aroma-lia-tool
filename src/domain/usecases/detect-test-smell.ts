import { TestSmell, TestSwitchModel } from '../models';

export interface DetectTestSmell {
  execute(testSwitch: TestSwitchModel): TestSmell[];
}
