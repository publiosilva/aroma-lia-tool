import { ASTNodeModel, FunctionOrMethodDeclarationModel } from '../../models';

export interface FindAllFunctionOrMethodDeclarations {
  execute(node: ASTNodeModel): FunctionOrMethodDeclarationModel[];
}
