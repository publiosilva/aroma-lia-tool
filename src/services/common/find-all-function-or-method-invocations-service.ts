import { ASTNodeModel, FunctionOrMethodInvocationModel } from '../../domain/models';
import { FindAllFunctionOrMethodInvocations, GetLiteralValue } from '../../domain/usecases';


export class FindAllFunctionOrMethodInvocationsService implements FindAllFunctionOrMethodInvocations {
  constructor(
    private readonly getLiteralValue: GetLiteralValue
  ) { }

  execute(node: ASTNodeModel): FunctionOrMethodInvocationModel[] {
    const invocations: FunctionOrMethodInvocationModel[] = [];

    const callNode = node.children.find(({ type }) => type === 'call');

    if (callNode) {
      invocations.push(this.extractCallData(callNode));
    }

    const callExpressionNode = node.children.find(({ type }) => type === 'call_expression');

    if (callExpressionNode) {
      invocations.push(this.extractCallExpressionData(callExpressionNode));
    }

    const methodInvocationChild = node.children.find(({ type }) => type === 'method_invocation');

    if (methodInvocationChild) {
      const methodInvocation = this.extractMethodInvocationData(methodInvocationChild);

      if (methodInvocation) {
        invocations.push(methodInvocation);
      }
    }

    const invocationExpression = node.children.find(({ type }) => type === 'invocation_expression');

    if (invocationExpression) {
      invocations.push(this.extractInvocationExpressionData(invocationExpression));
    }


    const childrenInvocations: FunctionOrMethodInvocationModel[] = node.children.reduce((prev: FunctionOrMethodInvocationModel[], curr: ASTNodeModel) => {
      return [...prev, ...this.execute(curr)];
    }, []);

    return [...invocations, ...childrenInvocations];
  }

  private extractInvocationExpressionData(node: ASTNodeModel): FunctionOrMethodInvocationModel {
    const memberExpressionNode = node.children.find((c) => c.type === 'member_access_expression');
    const identifier = memberExpressionNode
      ? this.getLiteralValue.execute(memberExpressionNode)
      : node?.children.filter(({ type }) => type === 'identifier').at(-1)?.value || '';
    const parameterListNode = node.children.find(({ type }) => type === 'argument_list');
    const parameterNodes = parameterListNode?.children.filter(({ type }) => !['(', ',', ')'].includes(type));

    return {
      identifier,
      node,
      parameterListNode,
      parameterNodes,
    };
  }

  private extractCallData(node: ASTNodeModel): FunctionOrMethodInvocationModel {
    const callIdentifier = node?.children.filter(({ type }) => ['identifier', '.'].includes(type)).map(({ value }) => value).join('') || '';

    if (callIdentifier) {
      const parameterListNode = node.children.find(({ type }) => type === 'argument_list');
      const parameterNodes = parameterListNode?.children.filter(({ type }) => !['(', ',', ')'].includes(type));

      return { identifier: callIdentifier, node, parameterListNode, parameterNodes };
    } else {
      const attributeNode = node.children.find(({ type }) => type === 'attribute');
      const identifier = attributeNode ? this.getLiteralValue.execute(attributeNode) : '';
      const parameterListNode = node.children.find(({ type }) => type === 'argument_list');
      const parameterNodes = parameterListNode?.children.filter(({ type }) => !['(', ',', ')'].includes(type));

      return { identifier, node, parameterListNode, parameterNodes };
    }
  }

  private extractCallExpressionData(
    node: ASTNodeModel,
    identifierQueue: string[] = [],
    parameterListNodesQueue: (ASTNodeModel | undefined)[] = []
  ): FunctionOrMethodInvocationModel {
    const memberExpressionNode = node.children.find((c) => c.type === 'member_expression');

    if (memberExpressionNode) {
      identifierQueue.push(memberExpressionNode.children.find(({ type }) => type === 'property_identifier')?.value || '');
      parameterListNodesQueue.push(node.children.find(({ type }) => type === 'arguments'));

      const chainedCallExpressionNode = memberExpressionNode.children.find(({ type }) => type === 'call_expression');
      const chained = chainedCallExpressionNode ? this.extractCallExpressionData(chainedCallExpressionNode, identifierQueue, parameterListNodesQueue) : undefined;

      const identifier = identifierQueue.shift() || '';
      const parameterListNode = parameterListNodesQueue.shift();
      const parameterNodes = parameterListNode?.children.filter(({ type }) => !['(', ',', ')'].includes(type));

      return { chained, identifier, node, parameterListNode, parameterNodes };
    } else {
      identifierQueue.push(node.children.find(({ type }) => type === 'identifier')?.value || '');
      parameterListNodesQueue.push(node.children.find(({ type }) => type === 'arguments'));

      const identifier = identifierQueue.shift() || '';
      const parameterListNode = parameterListNodesQueue.shift();
      const parameterNodes = parameterListNode?.children.filter(({ type }) => !['(', ',', ')'].includes(type));

      return { identifier, node, parameterListNode, parameterNodes };
    }
  }

  private extractMethodInvocationData(node: ASTNodeModel): FunctionOrMethodInvocationModel | undefined {
    const identifiersNodes = node.children.filter(({ type }) => ['identifier', '.'].includes(type));
    const parameterListNode = node.children.find(({ type }) => type === 'argument_list');
    const parameterNodes = parameterListNode?.children.filter(({ type }) => !['(', ',', ')'].includes(type));
    const identifier = identifiersNodes?.map(({ value }) => value).join('');

    return identifier ? { identifier, node, parameterListNode, parameterNodes } : undefined;
  }
}
