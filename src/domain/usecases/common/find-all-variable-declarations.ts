import { ASTNodeModel, VariableDeclararionModel } from '../../models';

export interface FindAllVariableDeclarations {
  execute(node: ASTNodeModel): VariableDeclararionModel[];
}
