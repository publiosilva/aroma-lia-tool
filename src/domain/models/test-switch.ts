export interface TestSwitchModel {
  filePath?: string;
  isIgnored: boolean; // this test suite is skipped
  name: string;
  tests: TestModel[];
}

export interface TestModel {
  asserts: TestAssertModel[];
  endLine?: number;
  events: TestEventModel[];
  isExclusive: boolean; // only this test runs
  isIgnored: boolean; // this test is skipped
  name: string;
  startLine?: number;
}

export enum TestEventTypeModel {
  assert = 'assert',
  print = 'print',
  sleep = 'sleep',
  unknown = 'unknown',
}

export interface TestEventModel {
  endLine: number;
  name: string;
  startLine: number;
  type: TestEventTypeModel;
}

export interface TestAssertModel {
  literalActual?: string;
  matcher: string;
  literalExpected?: string;
  message?: string;
  startLine: number;
  endLine: number;
}
