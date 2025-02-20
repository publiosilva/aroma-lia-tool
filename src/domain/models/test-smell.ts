import { TestModel, TestSwitchModel } from './test-switch';

export interface TestSmell {
  name: string;
  test: TestModel;
  testSwitch: TestSwitchModel;
  startLine?: number;
  endLine?: number;
}
