import { ASTNodeModel } from '../../domain/models';
import { GetLiteralValue } from '../../domain/usecases';

export class GetLiteralValueService implements GetLiteralValue {
  execute(node: ASTNodeModel): string {
    return node.value + node.children.reduce((prev, curr) => {
      return prev + this.execute(curr);
    }, '');
  }
}
