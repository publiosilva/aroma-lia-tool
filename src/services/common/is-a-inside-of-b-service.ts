import { ASTNodeModel } from '../../domain/models';
import { IsAInsideOfB } from '../../domain/usecases';

export class IsAInsideOfBService implements IsAInsideOfB {
  execute(a: ASTNodeModel, b: ASTNodeModel): boolean {
    return a.span[0] >= b.span[0] && a.span[2] <= b.span[2];
  }
}
