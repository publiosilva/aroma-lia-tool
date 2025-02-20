import { ASTModel } from '../models';

export interface GenerateAST {
  execute(filePath: string): Promise<ASTModel>
}
