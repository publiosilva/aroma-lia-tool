import { DecoratorModel, ASTNodeModel, ClassDeclarationModel } from '../../domain/models';
import { FindAllClassDeclarations, GetLiteralValue } from '../../domain/usecases';

export class FindAllClassDeclarationsService implements FindAllClassDeclarations {
  constructor(
    private readonly getLiteralValue: GetLiteralValue
  ) { }

  execute(node: ASTNodeModel): ClassDeclarationModel[] {
    return this.extractClassDeclarations(node);
  }

  private extractClassDeclarations(node: ASTNodeModel, parent: ASTNodeModel | null = null): ClassDeclarationModel[] {
    const classDeclarations: ClassDeclarationModel[] = [];
    const classDeclarationNodeTypes = [
      'class_declaration', // Java, C#
      'class_definition', // Python
    ];

    if (classDeclarationNodeTypes.includes(node.type)) {
      const classBodyNodeTypes = [
        'block', // Python
        'class_body', // Java
        'declaration_list', // C#
      ];
      const classBodyNode = node?.children.find(({ type }) => classBodyNodeTypes.includes(type));
      const decorators = parent && parent.type == 'decorated_definition' ? this.extractDecorators(parent) : this.extractDecorators(node);
      const identifier = node?.children.find(({ type }) => type === 'identifier')?.value || '';
      const superclasses = this.extractSuperclasses(node);

      classDeclarations.push({
        classBodyNode,
        decorators,
        identifier,
        node,
        superclasses,
      });
    }

    const childrenClassDeclarations: ClassDeclarationModel[] = node.children.reduce((prev: ClassDeclarationModel[], curr: ASTNodeModel) => {
      return [...prev, ...this.extractClassDeclarations(curr, node)];
    }, []);

    return [...classDeclarations, ...childrenClassDeclarations];
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

  private extractSuperclasses(classNode: ASTNodeModel): string[] {
    const superclassNodeTypes = [
      'superclass', // Java
      'base_list', // C#
    ];
    const superclassNodes = classNode?.children.filter(({ type }) => superclassNodeTypes.includes(type));

    if (superclassNodes && superclassNodes.length > 0) {
      const typeIdentifierNodes = superclassNodes?.flatMap(({ children }) =>
        children.filter(({ type }) => [
          'identifier', // C#
          'type_identifier', // Java
        ].includes(type))
      );

      return typeIdentifierNodes?.map(({ value }) => value) || [];
    }

    // Python

    const argumentListNode = classNode?.children.find(({ type }) => type === 'argument_list');
    const attributeNodes = argumentListNode?.children.filter(({ type }) => type === 'attribute');

    return attributeNodes?.map((attributeNode) => this.getLiteralValue.execute(attributeNode)) || [];
  }
}
