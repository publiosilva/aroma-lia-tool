import { ASTNodeModel } from './ast';

export interface FunctionOrMethodInvocationModel {
  chained?: FunctionOrMethodInvocationModel,
  identifier: string,
  node: ASTNodeModel,
  parameterListNode?: ASTNodeModel,
  parameterNodes?: ASTNodeModel[],
}
