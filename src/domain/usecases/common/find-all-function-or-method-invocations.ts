import { ASTNodeModel, FunctionOrMethodInvocationModel } from '../../models';

export interface FindAllFunctionOrMethodInvocations {
  execute(node: ASTNodeModel): FunctionOrMethodInvocationModel[];
}
