export interface ASTModel {
  children: ASTNodeModel[];
  span: number[];
  type: string;
  value: string;
}

export interface ASTNodeModel {
  children: ASTNodeModel[];
  span: number[];
  type: string;
  value: string;
}

export interface ASTImportDeclarationModel extends ASTNodeModel {
  type: 'import_declaration';
  value: string;
}

export interface ASTScopedIdentifierModel extends ASTNodeModel {
  type: 'scoped_identifier';
  value: string;
}

export interface ASTIdentifierModel extends ASTNodeModel {
  type: 'identifier';
  value: string;
}

export interface ASTImportModel extends ASTNodeModel {
  type: 'import';
  value: string;
}

export interface ASTStaticModel extends ASTNodeModel {
  type: 'static';
  value: string;
}

export interface ASTClassModel extends ASTNodeModel {
  type: 'class';
  value: string;
}

export interface ASTModifiersModel extends ASTNodeModel {
  type: 'modifiers';
  value: string;
}

export interface ASTAnnotationModel extends ASTNodeModel {
  type: 'annotation';
  value: string;
}

export interface ASTAnnotationArgumentListModel extends ASTNodeModel {
  type: 'annotation_argument_list';
  value: string;
}

export interface ASTPublicModel extends ASTNodeModel {
  type: 'public';
  value: string;
}

export interface ASTVoidTypeModel extends ASTNodeModel {
  type: 'void_type';
  value: string;
}

export interface ASTMarkerAnnotationModel extends ASTNodeModel {
  type: 'marker_annotation';
  value: string;
}

export interface ASTExpressionStatementModel extends ASTNodeModel {
  type: 'expression_statement';
  value: string;
}

export interface ASTLocalVariableDeclarationModel extends ASTNodeModel {
  type: 'local_variable_declaration';
  value: string;
}

export interface ASTThrowsModel extends ASTNodeModel {
  type: 'throws';
  value: string;
}

export interface ASTFormalParametersModel extends ASTNodeModel {
  type: 'formal_parameters';
  value: string;
}

export interface ASTBlockModel extends ASTNodeModel {
  type: 'block';
  value: string;
}

export interface ASTAsteriskModel extends ASTNodeModel {
  type: 'asterisk';
  value: string;
}

export interface ASTFieldAccessModel extends ASTNodeModel {
  type: 'field_access';
  value: string;
}

export interface ASTObjectCreationExpressionModel extends ASTNodeModel {
  type: 'object_creation_expression';
  value: string;
}

export interface ASTMethodInvocationModel extends ASTNodeModel {
  type: 'method_invocation';
  value: string;
}

export interface ASTArgumentListModel extends ASTNodeModel {
  type: 'argument_list';
  value: string;
}

export interface ASTFileModel extends ASTNodeModel {
  type: 'File';
  value: string;
}

export interface ASTDecimalIntegerLiteralModel extends ASTNodeModel {
  type: 'decimal_integer_literal';
  value: string;
}

export interface ASTStringLiteralModel extends ASTNodeModel {
  type: 'string_literal';
  value: string;
}
