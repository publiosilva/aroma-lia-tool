import { ASTModel, ASTNodeModel, TestAssertModel, TestEventModel, TestEventTypeModel, TestSwitchModel } from '../../domain/models';
import { ExtractTestsFromAST, FindAllClassDeclarations, FindAllFunctionOrMethodDeclarations, FindAllFunctionOrMethodInvocations, GetLiteralValue, IsAInsideOfB } from '../../domain/usecases';

export class ExtractTestsFromPythonPyTestASTService implements ExtractTestsFromAST {
  private readonly printMethods = [
    'print',
  ];

  private readonly sleepMethods = [
    'asyncio.sleep',
    'time.sleep',
    'sleep',
  ];

  private readonly disableAnnotations = [
    'skip',
    'mark.skip',
    'pytest.mark.skip',
    'skipif',
    'mark.skipif',
    'pytest.mark.skipif',
  ];

  constructor(
    private findAllClassDeclarations: FindAllClassDeclarations,
    private findAllMethodDeclarations: FindAllFunctionOrMethodDeclarations,
    private findAllMethodInvocations: FindAllFunctionOrMethodInvocations,
    private getLiteralValue: GetLiteralValue,
    private isAInsideOfB: IsAInsideOfB,
  ) { }

  execute(ast: ASTModel): TestSwitchModel[] {
    const testSwitchesMap: Map<string, TestSwitchModel> = new Map([
      ['Unnamed', {
        isIgnored: false,
        name: 'Unnamed',
        tests: [],
      }],
    ]);
    const classDeclarations = this.findAllClassDeclarations.execute(ast);

    classDeclarations.forEach((classDeclaration) => {
      if (classDeclaration.identifier.startsWith('Test')) {
        const methodDeclarations = this.findAllMethodDeclarations.execute(classDeclaration.node);

        if (methodDeclarations.some(({ identifier }) => identifier.startsWith('test'))) {
          testSwitchesMap.set(classDeclaration.identifier, {
            isIgnored: classDeclaration.decorators?.some(({ identifier }) => this.disableAnnotations.includes(identifier)) || false,
            name: classDeclaration.identifier,
            tests: [],
          });
        }
      }
    });

    const methodDeclarations = this.findAllMethodDeclarations.execute(ast);

    methodDeclarations.forEach((methodDeclaration) => {
      if (methodDeclaration?.identifier?.startsWith('test')) {
        const asserts = this.extractAsserts(methodDeclaration.node);
        const test = {
          asserts: asserts,
          endLine: methodDeclaration.node.span[2],
          events: this.extractEvents(methodDeclaration.node, asserts),
          isExclusive: false,
          isIgnored: methodDeclaration.decorators?.some(({ identifier }) => this.disableAnnotations.includes(identifier)) || false,
          name: methodDeclaration.identifier,
          startLine: methodDeclaration.node.span[0],
        };
        const parent = classDeclarations.find((classDeclaration) => this.isAInsideOfB.execute(methodDeclaration.node, classDeclaration.node));

        if (parent) {
          testSwitchesMap.get(parent.identifier)?.tests.push(test);
        } else {
          testSwitchesMap.get('Unnamed')?.tests.push(test);
        }
      }
    });

    return Array.from(testSwitchesMap.values()).filter(({ tests }) => tests.length > 0);
  }

  private extractEvents(node: ASTNodeModel, asserts: TestAssertModel[]): TestEventModel[] {
    const events: TestEventModel[] = [];
    const methodInvocations = this.findAllMethodInvocations.execute(node);

    console.log(methodInvocations);

    methodInvocations.forEach(({ identifier, node }) => {
      let type = TestEventTypeModel.unknown;

      if (this.printMethods.includes(identifier)) {
        type = TestEventTypeModel.print;
      } else if (this.sleepMethods.includes(identifier)) {
        type = TestEventTypeModel.sleep;
      }

      events.push({
        endLine: node.span[2],
        name: identifier,
        startLine: node.span[0],
        type,
      });
    });

    asserts.forEach((assert) => {
      events.push({
        endLine: assert.endLine,
        name: assert.matcher,
        startLine: assert.startLine,
        type: TestEventTypeModel.assert,
      });
    });

    return events.sort((a, b) => a.startLine - b.startLine);
  }

  private extractAsserts(node: ASTNodeModel): TestAssertModel[] {
    const asserts: TestAssertModel[] = [];

    node.children.forEach((child) => {
      if (child.type === 'assert_statement') {
        asserts.push(this.extractAssertData(child));
      } else {
        asserts.push(...this.extractAsserts(child));
      }
    });

    return asserts;
  }

  private extractAssertData(assertStatementNode: ASTNodeModel): TestAssertModel {
    const testAssert: TestAssertModel = {
      endLine: assertStatementNode.span[2],
      matcher: '',
      startLine: assertStatementNode.span[0],
    };
    const comparisonOperatorNode = assertStatementNode.children.find(({ type }) => type === 'comparison_operator');

    if (comparisonOperatorNode) {
      const first = comparisonOperatorNode.children.at(0);
      const last = comparisonOperatorNode.children.at(-1);
      const middle = comparisonOperatorNode.children.slice(1, -1);

      if (first && last && middle) {
        testAssert.literalActual = this.getLiteralValue.execute(first);
        testAssert.matcher = middle.map(({ value }) => value).join(' ');
        testAssert.literalExpected = this.getLiteralValue.execute(last);
      }
    } else {
      const actualNode = assertStatementNode.children.find(({ type }) => type !== 'assert');

      testAssert.literalActual = actualNode ? this.getLiteralValue.execute(actualNode) : '';
      testAssert.matcher = 'is True';
    }

    const stringNode = assertStatementNode.children.find(({ type }) => type === 'string');

    if (stringNode) {
      testAssert.message = this.getLiteralValue.execute(stringNode);
    }

    return testAssert;
  }
}
