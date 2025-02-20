import { ASTNodeModel } from '../../models';

export interface GetLiteralValue {
  execute(node: ASTNodeModel): string;
}
