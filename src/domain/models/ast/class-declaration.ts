import { DecoratorModel } from './decorator';
import { ASTNodeModel } from './ast';

export interface ClassDeclarationModel {
  classBodyNode?: ASTNodeModel,
  decorators?: DecoratorModel[],
  identifier: string,
  node: ASTNodeModel,
  superclasses?: string[],
}
