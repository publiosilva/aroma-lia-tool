import { ASTModel, TestSwitchModel } from '../models';

export interface ExtractTestsFromAST {
  execute(ast: ASTModel): TestSwitchModel[];
}
