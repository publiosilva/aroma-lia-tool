import axios from 'axios';
import { ASTModel } from '../../domain/models';
import { GenerateAST } from '../../domain/usecases';

export class GenerateASTService implements GenerateAST {
  async execute(filePath: string): Promise<ASTModel> {
    const url = 'http://localhost:8080/ast';
    const data = {
      file_path: filePath,
    };

    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  }
}
