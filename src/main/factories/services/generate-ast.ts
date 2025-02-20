import { GenerateAST } from '../../../domain/usecases';
import { GenerateASTService } from '../../../services';

export function makeGenerateASTService(): GenerateAST {
  return new GenerateASTService();
}
