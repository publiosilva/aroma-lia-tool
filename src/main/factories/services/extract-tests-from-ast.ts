import { ExtractTestsFromAST } from '../../../domain/usecases';
import { ExtractTestsFromCSharpXUnitASTService, ExtractTestsFromJavaJUnitASTService, ExtractTestsFromPythonPyTestASTService, ExtractTestsFromPythonUnittestASTService, FindAllClassDeclarationsService, FindAllFunctionOrMethodDeclarationsService, FindAllFunctionOrMethodInvocationsService, GetLiteralValueService, IsAInsideOfBService } from '../../../services';

export function makeExtractTestsFromCSharpXUnitASTService(): ExtractTestsFromAST {
  return new ExtractTestsFromCSharpXUnitASTService(
    new FindAllClassDeclarationsService(
      new GetLiteralValueService()
    ),
    new FindAllFunctionOrMethodDeclarationsService(
      new GetLiteralValueService()
    ),
    new FindAllFunctionOrMethodInvocationsService(
      new GetLiteralValueService()
    ),
    new GetLiteralValueService()
  );
}

export function makeExtractTestsFromJavaJUnitASTService(): ExtractTestsFromAST {
  return new ExtractTestsFromJavaJUnitASTService(
    new FindAllClassDeclarationsService(
      new GetLiteralValueService()
    ),
    new FindAllFunctionOrMethodDeclarationsService(
      new GetLiteralValueService()
    ),
    new FindAllFunctionOrMethodInvocationsService(
      new GetLiteralValueService()
    ),
    new GetLiteralValueService()
  );
}

export function makeExtractTestsFromPythonPyTestASTService(): ExtractTestsFromAST {
  return new ExtractTestsFromPythonPyTestASTService(
    new FindAllClassDeclarationsService(
      new GetLiteralValueService()
    ),
    new FindAllFunctionOrMethodDeclarationsService(
      new GetLiteralValueService()
    ),
    new FindAllFunctionOrMethodInvocationsService(
      new GetLiteralValueService()
    ),
    new GetLiteralValueService(),
    new IsAInsideOfBService(),
  );
}

export function makeExtractTestsFromPythonUnittestASTService(): ExtractTestsFromAST {
  return new ExtractTestsFromPythonUnittestASTService(
    new FindAllClassDeclarationsService(
      new GetLiteralValueService()
    ),
    new FindAllFunctionOrMethodDeclarationsService(
      new GetLiteralValueService()
    ),
    new FindAllFunctionOrMethodInvocationsService(
      new GetLiteralValueService()
    ),
    new GetLiteralValueService()
  );
}
