import { ASTNodeModel } from '../../models';

export interface IsAInsideOfB {
  execute(a: ASTNodeModel, b: ASTNodeModel): boolean;
}
