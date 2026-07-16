const buttons = document.querySelectorAll("button");
const display = document.getElementById("calci-input");

// Separate functions
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;

const divide = (a, b) => {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
};

const modulus = (a, b) => {
  if (b === 0) throw new Error("Modulus by zero");
  return a % b;
};

// Safe parser with parentheses + modulus + unary minus support
function calculate(expression) {
  try {
    // Handle unary minus: turn "-5+3" into "0-5+3", "(-5+3)" into "(0-5+3)"
    let expr = expression.replace(/^-/, "0-").replace(/\(-/g, "(0-");

    const tokens = expr.match(/(\d+\.?\d*|\+|\-|\*|\/|%|\(|\))/g);
    if (!tokens) return "Error";

    const output = [];
    const operators = [];
    const precedence = { "+": 1, "-": 1, "*": 2, "/": 2, "%": 2 };
    const isOp = (t) => ["+", "-", "*", "/", "%"].includes(t);

    tokens.forEach(token => {
      if (!isNaN(token)) {
        output.push(parseFloat(token));
      } else if (isOp(token)) {
        while (
          operators.length &&
          isOp(operators[operators.length - 1]) &&
          precedence[operators[operators.length - 1]] >= precedence[token]
        ) {
          output.push(operators.pop());
        }
        operators.push(token);
      } else if (token === "(") {
        operators.push(token);
      } else if (token === ")") {
        while (operators.length && operators[operators.length - 1] !== "(") {
          output.push(operators.pop());
        }
        operators.pop(); // remove "("
      }
    });

    while (operators.length) {
      output.push(operators.pop());
    }

    // Evaluate postfix
    const stack = [];
    output.forEach(token => {
      if (typeof token === "number") {
        stack.push(token);
      } else {
        const b = stack.pop();
        const a = stack.pop();
        if (a === undefined || b === undefined) throw new Error("Malformed expression");

        let result;
        switch (token) {
          case "+": result = add(a, b); break;
          case "-": result = subtract(a, b); break;
          case "*": result = multiply(a, b); break;
          case "/": result = divide(a, b); break;
          case "%": result = modulus(a, b); break;
        }
        stack.push(result);
      }
    });

    if (stack.length !== 1 || isNaN(stack[0])) return "Error";
    return stack[0];
  } catch (e) {
    return "Error: " + e.message;
  }
}

// Button handling
buttons.forEach(button => {
  button.addEventListener("click", function () {
    const value = button.textContent;
    if (value === "AC") {
      display.value = "";
    } else if (value === "=") {
      display.value = calculate(display.value);
    } else {
      // prevent double operators (but allow a leading "-" for negative numbers)
      const isOperator = ["+", "-", "*", "/", "%"].includes(value);
      const lastChar = display.value.slice(-1);
      if (isOperator && ["+", "-", "*", "/", "%"].includes(lastChar)) {
        return;
      }
      display.value += value;
    }
  });
});

// Keyboard input handling
document.addEventListener("keydown", function (event) {
  // Let browser/OS shortcuts (copy, refresh, devtools, etc.) pass through untouched
  if (event.ctrlKey || event.metaKey || event.altKey) return;

  const allowedKeys = ["0","1","2","3","4","5","6","7","8","9","+","-","*","/","%",".","Enter","Backspace","(",")"];

  if (allowedKeys.includes(event.key)) {
    if (!isNaN(event.key) || ["+","-","*","/","%","(",")","."].includes(event.key)) {
      const isOperator = ["+","-","*","/","%"].includes(event.key);
      const lastChar = display.value.slice(-1);
      if (isOperator && ["+","-","*","/","%"].includes(lastChar)) {
        return;
      }
      display.value += event.key;
    } else if (event.key === "Enter") {
      display.value = calculate(display.value);
    } else if (event.key === "Backspace") {
      display.value = display.value.slice(0, -1);
    }
  } else {
    alert("Invalid key pressed!");
    event.preventDefault();
  }
});
