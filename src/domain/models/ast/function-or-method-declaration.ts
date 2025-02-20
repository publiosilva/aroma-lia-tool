import { DecoratorModel } from './decorator';
import { ASTNodeModel } from './ast';

export interface FunctionOrMethodDeclarationModel {
  decorators?: DecoratorModel[],
  identifier: string,
  node: ASTNodeModel,
}
