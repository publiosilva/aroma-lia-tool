import { ASTNodeModel } from './ast';

export interface VariableDeclararionModel {
  identifier: string,
  node: ASTNodeModel,
  valueNode?: ASTNodeModel,
  typeChild?: ASTNodeModel,
}
