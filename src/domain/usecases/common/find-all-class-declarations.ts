import { ASTNodeModel, ClassDeclarationModel } from '../../models';

export interface FindAllClassDeclarations {
  execute(node: ASTNodeModel): ClassDeclarationModel[];
}
