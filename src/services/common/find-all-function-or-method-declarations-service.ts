import { ASTNodeModel, DecoratorModel, FunctionOrMethodDeclarationModel } from '../../domain/models';
import { FindAllFunctionOrMethodDeclarations, GetLiteralValue } from '../../domain/usecases';

export class FindAllFunctionOrMethodDeclarationsService implements FindAllFunctionOrMethodDeclarations {
  constructor(
    private readonly getLiteralValue: GetLiteralValue
  ) { }

  execute(node: ASTNodeModel): FunctionOrMethodDeclarationModel[] {
    return this.extractFunctionOrMethodDeclarations(node);
  }

  private extractFunctionOrMethodDeclarations(node: ASTNodeModel, parent: ASTNodeModel | null = null): FunctionOrMethodDeclarationModel[] {
    const methodDeclarations: FunctionOrMethodDeclarationModel[] = [];

    if (['function_definition', 'method_declaration'].includes(node.type)) {
      const decorators = parent && parent.type == 'decorated_definition' ? this.extractDecorators(parent) : this.extractDecorators(node);
      const identifier = node?.children.find(({ type }) => type === 'identifier')?.value || '';

      methodDeclarations.push({ decorators, identifier, node });
    }

    const childrenMethodDeclarations: FunctionOrMethodDeclarationModel[] = node.children.reduce((prev: FunctionOrMethodDeclarationModel[], curr: ASTNodeModel) => {
      return [...prev, ...this.extractFunctionOrMethodDeclarations(curr, node)];
    }, []);

    return [...methodDeclarations, ...childrenMethodDeclarations];
  }

  private extractDecorators(node: ASTNodeModel): DecoratorModel[] {
    const decorators: DecoratorModel[] = [];
    const modifiersNode = node?.children.find(({ type }) => type === 'modifiers');

    if (modifiersNode) {
      const markerAnnotations = modifiersNode?.children.filter(({ type }) => ['annotation', 'marker_annotation'].includes(type));

      markerAnnotations.forEach((markerAnnotation) => {
        decorators.push({
          identifier: markerAnnotation?.children.find(({ type }) => type === 'identifier')?.value || '',
          node: markerAnnotation,
        });
      });
    }

    const attributeListNode = node?.children.find(({ type }) => type === 'attribute_list');

    if (attributeListNode) {
      const attributes = attributeListNode?.children.filter(({ type }) => type === 'attribute');

      attributes.forEach((attribute) => {
        decorators.push({
          identifier: attribute?.children.find(({ type }) => type === 'identifier')?.value || '',
          node: attribute,
        });

        const attributeArgumentListNode = attribute?.children.find(({ type }) => type === 'attribute_argument_list');

        if (attributeArgumentListNode) {
          const attributeArgumentNodes = attributeArgumentListNode?.children.filter(({ type }) => type === 'attribute_argument');

          attributeArgumentNodes.forEach((attributeArgumentNode) => {
            decorators.push({
              identifier: attributeArgumentNode?.children.find(({ type }) => type === 'name_equals')?.children.find(({ type }) => type === 'identifier')?.value || '',
              node: attributeArgumentNode,
            });
          });
        }
      });
    }

    const decoratorNodes = node?.children.filter(({ type }) => type === 'decorator') || [];

    decoratorNodes.forEach((node) => {
      const dottedNameNode = node?.children.find(({ type }) => type === 'dotted_name');

      decorators.push({
        identifier: dottedNameNode ? this.getLiteralValue.execute(dottedNameNode) : '',
        node: node,
      });
    });

    return decorators;
  }
}
