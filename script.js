const buttons = document.querySelectorAll("button");
const display = document.getElementById("calci-input");

// Separate functions
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => (b !== 0 ? a / b : "Error: Division by zero");
const modulus = (a, b) => (b !== 0 ? a % b : "Error: Modulus by zero");

// Safe parser with parentheses + modulus
function calculate(expression) {
  try {
    // normalize and handle unary minus (leading or after '(')
    expression = expression.replace(/\s+/g, "");
    expression = expression.replace(/(^|[\(])-/g, "$10-");

    // match numbers including leading-dot decimals like .5
    const tokens = expression.match(/(\d*\.\d+|\d+|\+|\-|\*|\/|%|\(|\))/g);
    if (!tokens) return "Error";

    const output = [];
    const operators = [];
    const precedence = { "+": 1, "-": 1, "*": 2, "/": 2, "%": 2 };

    tokens.forEach(token => {
      if (!isNaN(token)) {
        output.push(parseFloat(token));
      } else if (["+","-","*","/","%"].includes(token)) {
        while (
          operators.length &&
          ["+","-","*","/","%"].includes(operators[operators.length - 1]) &&
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

    return stack.length === 1 ? stack[0] : "Error";
  } catch {
    return "Error";
  }
}

// Button handling
buttons.forEach(button => {
  button.addEventListener("click", function() {
    const value = button.textContent;
    if (value === "AC") {
      display.value = "";
    } else if (value === "=") {
      display.value = calculate(display.value);
    } else {
      // prevent double operators
      if (["+","-","*","/","%"].includes(value) &&
          ["+","-","*","/","%"].includes(display.value.slice(-1))) {
        return;
      }
      display.value += value;
    }
  });
});

// Keyboard input handling
document.addEventListener("keydown", function(event) {
  const allowedKeys = ["0","1","2","3","4","5","6","7","8","9","+","-","*","/","%",".","Enter","Backspace","(",")"];

  if (allowedKeys.includes(event.key)) {
    if (!isNaN(event.key) || ["+","-","*","/","%","(",")","."].includes(event.key)) {
      // prevent double operators
      if (["+","-","*","/","%"].includes(event.key) &&
          ["+","-","*","/","%"].includes(display.value.slice(-1))) {
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
