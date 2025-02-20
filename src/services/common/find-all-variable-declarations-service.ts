import { ASTNodeModel, VariableDeclararionModel } from '../../domain/models';
import { FindAllVariableDeclarations } from '../../domain/usecases';

export class FindAllVariableDeclarationsService implements FindAllVariableDeclarations {
  execute(node: ASTNodeModel): VariableDeclararionModel[] {
    const localVariableDeclarations: VariableDeclararionModel[] = [];

    if (['variable_declarator', 'local_variable_declaration'].includes(node.type)) {
      const [typeChild, declarationChild] = node.children;
      const identifier = declarationChild?.children.find(({ type }) => type === 'identifier')?.value || '';
      const valueNode = declarationChild?.children[1]?.type === '=' ? declarationChild?.children[2] : undefined;

      localVariableDeclarations.push({ identifier, node, valueNode, typeChild });
    }

    const childrenLocalVariableDeclarations: VariableDeclararionModel[] = node.children.reduce((prev: VariableDeclararionModel[], curr: ASTNodeModel) => {
      return [...prev, ...this.execute(curr)];
    }, []);

    return [...localVariableDeclarations, ...childrenLocalVariableDeclarations];
  }
}
