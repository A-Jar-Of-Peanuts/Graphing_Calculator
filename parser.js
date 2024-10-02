/**
 * This file contains a simple parser for a calculator language that supports basic arithmetic operations, variables, constants, and functions. 
 * EBNF Grammar specification for the calculator language:
 * 
 * equation     ::= variable "=" expression
 * expression   ::= term (("+" | "-") term)*
 * term         ::= factor (("*" | "/" | "%") factor)*
 * factor       ::= primary ("^" primary)*
 * primary      ::= number | variable | constant | function | "(" expression ")"
 * function     ::= ("sin" | "cos" | "tan" | "ln" | "log") "(" expression ")"
 * constant     ::= "e" | "pi" | "i"
 * number       ::= digit+ ("." digit+)?
 * variable     ::= letter (letter | digit)*
 * digit        ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
 * letter       ::= "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z"
 */


const TOKEN_TYPE = {
    NUMBER: 'NUMBER',
    OPERATOR: 'OPERATOR',
    PARENTHESIS: 'PARENTHESIS',
    VARIABLE: 'VARIABLE',
    EQUALS: 'EQUALS',
    CONSTANT: 'CONSTANT',
    FUNCTION: 'FUNCTION',
    LETTER: 'LETTER',
    DIGIT: 'DIGIT'
};

/**
 * Converts the input equation string into a tokenized form for parsing.
 * @param {String} input string form of the input equation
 * @returns {Object[]} tokenized form of input
 */
function tokenize(input) {
    const tokens = [];
    const regex = /\s*(=>|[-+*/^()=]|[a-zA-Z_]\w*|\d*\.\d+|\d+)\s*/g;
    const constants = ['e', 'pi', 'i'];
    const functions = ['sin', 'cos', 'tan', 'ln', 'log'];
    let match;
    while ((match = regex.exec(input)) !== null) {
        if (match[0].trim()) {
            const token = match[0].trim();
            if (!isNaN(token)) {
                tokens.push({ type: TOKEN_TYPE.NUMBER, value: parseFloat(token) });
            } else if (['+', '-', '*', '/', '^'].includes(token)) {
                tokens.push({ type: TOKEN_TYPE.OPERATOR, value: token });
            } else if (['(', ')'].includes(token)) {
                tokens.push({ type: TOKEN_TYPE.PARENTHESIS, value: token });
            } else if (token === '=') {
                tokens.push({ type: TOKEN_TYPE.EQUALS, value: token });
            } else if (constants.includes(token)) {
                tokens.push({ type: TOKEN_TYPE.CONSTANT, value: token });
            } else if (functions.includes(token)) {
                tokens.push({ type: TOKEN_TYPE.FUNCTION, value: token });
            } else {
                tokens.push({ type: TOKEN_TYPE.VARIABLE, value: token });
            }
        }
    }
    return tokens;
}

/**
 * Converts the tokenized form of the input equation into an abstract syntax tree (AST).
 * @param {Object[]} tokens 
 * @returns {Object} AST representation of the input equation
 */
function parse(tokens) {
    let current = 0;

    /**
     * Parses an equation in the form of "variable = expression".
     * @returns {Object} AST node representing the equation
     */
    function parseEquation() {
        let left = parseVariable();
        if (tokens[current] && tokens[current].type === TOKEN_TYPE.EQUALS) {
            current++;
            let right = parseExpression();
            return {
                type: 'Equation',
                left: left,
                right: right
            };
        }
        throw new Error("Invalid equation format");
    }

    /**
     * Parses an expression in the form of "term ((+|-) term)*".
     * @returns {Object} AST node representing the expression
     */
    function parseExpression() {
        let node = parseTerm();
        while (current < tokens.length && (tokens[current].value === '+' || tokens[current].value === '-')) {
            let operator = tokens[current].value;
            current++;
            let right = parseTerm();
            if (!right) {
                throw new Error("Invalid expression format");
            }
            node = {
                type: 'BinaryExpression',
                operator: operator,
                left: node,
                right: right
            };
        }
        return node;
    }

    /**
     * Parses a term in the form of "factor ((*|/|%) factor)*".
     * @returns {Object} AST node representing the term
     */
    function parseTerm() {
        let node = parseFactor();
        while (current < tokens.length && (tokens[current].value === '*' || tokens[current].value === '/' || tokens[current].value === '%')) {
            let operator = tokens[current].value;
            current++;
            let right = parseFactor();
            if (!right) {
                throw new Error("Invalid term format");
            }
            node = {
                type: 'BinaryExpression',
                operator: operator,
                left: node,
                right: right
            };
        }
        return node;
    }

    /**
     * Parses a factor in the form of "primary (^ primary)*".
     * @returns {Object} AST node representing the factor
     */
    function parseFactor() {
        let node = parsePrimary();
        while (current < tokens.length && tokens[current].value === '^') {
            let operator = tokens[current].value;
            current++;
            let right = parsePrimary();
            if (!right) {
                throw new Error("Invalid factor format");
            }
            node = {
                type: 'BinaryExpression',
                operator: operator,
                left: node,
                right: right
            };
        }
        return node;
    }

    /**
     * Parses a primary expression in the form of "number | variable | constant | function | (expression)".
     * @returns {Object} AST node representing the primary expression
     */
    function parsePrimary() {
        let token = tokens[current];
        if (token.value === '(') {
            current++;
            let node = parseExpression();
            if (tokens[current] && tokens[current].value === ')') {
                current++; // skip ')'
            } else {
                throw new Error("Expected closing parenthesis");
            }
            return node;
        } else if (token.type === TOKEN_TYPE.NUMBER) {
            current++;
            return {
                type: 'Literal',
                value: token.value
            };
        } else if (token.type === TOKEN_TYPE.VARIABLE) {
            current++;
            return {
                type: 'Variable',
                name: token.value
            };
        } else if (token.type === TOKEN_TYPE.CONSTANT) {
            current++;
            return {
                type: 'Constant',
                name: token.value
            };
        } else if (token.type === TOKEN_TYPE.FUNCTION) {
            current++;
            let arg = parsePrimary();
            if (!arg) {
                throw new Error("Invalid function argument");
            }
            return {
                type: 'Function',
                name: token.value,
                argument: arg
            };
        } else {
            throw new Error("Invalid primary expression");
        }
    }

    /**
     * Parses a variable in the form of "letter (letter | digit)*".
     * @returns {Object} AST node representing a variable
     */
    function parseVariable() {
        let token = tokens[current];
        if (token.type === TOKEN_TYPE.VARIABLE) {
            current++;
            return {
                type: 'Variable',
                name: token.value
            };
        }
        throw new Error("Invalid variable");
    }

    return parseEquation();
}

/**
 * Converts the AST representation of the input equation into a lambda function. The 
 * lambda function returns the result of evaluating the input equation given a set of
 * variables `{x:..., y:..., ...}`. It also appends the result to the variables object.
 * 
 * @param {Object} ast AST representation of the input equation
 * @returns {Function} lambda function representing the input equation
 */
function astToLambda(ast) {
    switch (ast.type) {
        case 'Literal':
            return () => ast.value;
        case 'Variable':
            return (variables) => variables[ast.name];
        case 'Constant':
            return () => {
                switch (ast.name) {
                    case 'e': return Math.E;
                    case 'pi': return Math.PI;
                    case 'i': throw new Error("Imaginary unit 'i' not supported in real number calculations");
                    default: throw new Error(`Unknown constant: ${ast.name}`);
                }
            };
        case 'BinaryExpression':
            const left = astToLambda(ast.left);
            const right = astToLambda(ast.right);
            switch (ast.operator) {
                case '+': return (variables) => left(variables) + right(variables);
                case '-': return (variables) => left(variables) - right(variables);
                case '*': return (variables) => left(variables) * right(variables);
                case '/': return (variables) => left(variables) / right(variables);
                case '%': return (variables) => left(variables) % right(variables);
                case '^': return (variables) => Math.pow(left(variables), right(variables));
                default: throw new Error(`Unknown operator: ${ast.operator}`);
            }
        case 'Function':
            const arg = astToLambda(ast.argument);
            switch (ast.name) {
                case 'sin': return (variables) => Math.sin(arg(variables));
                case 'cos': return (variables) => Math.cos(arg(variables));
                case 'tan': return (variables) => Math.tan(arg(variables));
                case 'ln': return (variables) => Math.log(arg(variables));
                case 'log': return (variables) => Math.log10(arg(variables));
                default: throw new Error(`Unknown function: ${ast.name}`);
            }
        case 'Equation':
            const leftVar = ast.left.name;
            const rightExpr = astToLambda(ast.right);
            return (variables) => {
                variables[leftVar] = rightExpr(variables);
                return variables[leftVar];
            };
        default:
            throw new Error(`Unknown AST node type: ${ast.type}`);
    }
}

/**
 * Converts the input equation string into an abstract syntax tree (AST).
 * @param {String} input raw equation string 
 * @returns 
 */
function getEquation(input) {
    const tokens = tokenize(input);
    const ast = parse(tokens);

    return astToLambda(ast);
}


// const input = "y = x";
// try {
//     const equation = getEquation(input);
//     const variables = { x: Math.PI / 4 };
//     const result = equation(variables);
//     console.log(`Result: ${result}`);
//     console.log(`Variables: ${JSON.stringify(variables)}`);
// } catch (error) {
//     console.error(error.message);
// }