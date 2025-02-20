import {
  ASTModel,
  ASTNodeModel,
  FunctionOrMethodInvocationModel,
  TestAssertModel,
  TestEventModel,
  TestEventTypeModel,
  TestSwitchModel,
} from '../../domain/models';
import {
  ExtractTestsFromAST,
  FindAllClassDeclarations,
  FindAllFunctionOrMethodDeclarations,
  FindAllFunctionOrMethodInvocations,
  GetLiteralValue,
} from '../../domain/usecases';

export class ExtractTestsFromCSharpXUnitASTService implements ExtractTestsFromAST {
  private readonly assertMethods = [
    'Assert.True',
    'Assert.False',
    'Assert.Equal',
    'Assert.NotEqual',
    'Assert.Contains',
    'Assert.DoesNotContain',
    'Assert.Throws',
    'Assert.Null',
    'Assert.NotNull',
    'Assert.Same',
    'Assert.NotSame',
    'Assert.Fail',
    'Assert.InRange',
    'Assert.IsAssignableFrom',
    'Assert.Empty',
    'Assert.IsType',
    'Assert.IsNotAssignableFrom',
    'Assert.NotEmpty',
    'Assert.IsNotType',
    'Assert.NotInRange',
    'Assert.Equivalent',
    'Assert.Single',
  ];

  private readonly printMethods = [
    'Console.WriteLine',
  ];

  private readonly sleepMethods = [
    'System.Threading.Thread.Sleep',
    'Threading.Thread.Sleep',
    'Thread.Sleep',
    'Sleep',
  ];

  constructor(
    private findAllClassDeclarations: FindAllClassDeclarations,
    private findAllMethodDeclarations: FindAllFunctionOrMethodDeclarations,
    private findAllMethodInvocations: FindAllFunctionOrMethodInvocations,
    private getLiteralValue: GetLiteralValue
  ) { }

  execute(ast: ASTModel): TestSwitchModel[] {
    const testSwitches: TestSwitchModel[] = [];
    const classDeclarations = this.findAllClassDeclarations.execute(ast);

    classDeclarations.forEach((classDeclaration) => {
      const methodDeclarations = this.findAllMethodDeclarations.execute(classDeclaration.node);

      if (methodDeclarations.some(({ decorators }) => decorators?.some(({ identifier }) => ['Fact', 'Theory'].includes(identifier)))) {
        const testSwitch: TestSwitchModel = {
          isIgnored: classDeclaration.decorators?.some(({ identifier }) => identifier === 'Ignore') || false,
          name: classDeclaration.identifier,
          tests: [],
        };

        methodDeclarations.forEach((methodDeclaration) => {
          if (
            methodDeclaration.decorators?.some(({ identifier }) => ['Fact', 'Theory'].includes(identifier))
          ) {
            testSwitch.tests.push({
              asserts: this.extractAsserts(methodDeclaration.node),
              endLine: methodDeclaration.node.span[2],
              events: this.extractEvents(methodDeclaration.node),
              isExclusive: false,
              isIgnored: methodDeclaration.decorators?.some(({ identifier }) => identifier === 'Skip') || false,
              name: methodDeclaration.identifier,
              startLine: methodDeclaration.node.span[0],
            });
          }
        });

        testSwitches.push(testSwitch);
      }
    });

    return testSwitches.filter(({ tests }) => tests.length > 0);
  }

  private extractEvents(node: ASTNodeModel): TestEventModel[] {
    const events: TestEventModel[] = [];
    const methodInvocations = this.findAllMethodInvocations.execute(node);

    methodInvocations.forEach(({ identifier, node }) => {
      let type = TestEventTypeModel.unknown;

      if (this.assertMethods.includes(identifier)) {
        type = TestEventTypeModel.assert;
      } else if (this.printMethods.includes(identifier)) {
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

    return events;
  }

  private extractAsserts(node: ASTNodeModel): TestAssertModel[] {
    const methodInvocations = this.findAllMethodInvocations.execute(node);
    const assertMethodInvocations = methodInvocations.filter(({ identifier }) =>
      this.assertMethods.includes(identifier)
    );

    return assertMethodInvocations.map((methodInvocation) => this.extractAssertData(methodInvocation));
  }

  private extractAssertData(methodInvocation: FunctionOrMethodInvocationModel): TestAssertModel {
    const testAssert: TestAssertModel = {
      endLine: methodInvocation.node.span[2],
      matcher: methodInvocation.identifier,
      startLine: methodInvocation.node.span[0],
    };

    if (methodInvocation.parameterNodes?.length) {
      if (['Assert.Fail'].includes(methodInvocation.identifier)) {
        testAssert.message = this.getLiteralValue.execute(methodInvocation.parameterNodes[0]);
      } else {
        testAssert.literalActual = this.getLiteralValue.execute(methodInvocation.parameterNodes[0]);
      }

      if (methodInvocation.parameterNodes.length > 1) {
        if ([
          'Assert.True',
          'Assert.False',
        ].includes(methodInvocation.identifier)) {
          testAssert.message = this.getLiteralValue.execute(methodInvocation.parameterNodes[1]);
        } else {
          testAssert.literalExpected = this.getLiteralValue.execute(methodInvocation.parameterNodes[1]);
        }
      }
    }

    return testAssert;
  }
}
