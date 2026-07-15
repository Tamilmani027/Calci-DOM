const buttons = document.querySelectorAll("button");
const display = document.getElementById("calci-input");

// Separate functions
const Add = (a, b) => a + b;
const Sub = (a, b) => a - b;
const Mul = (a, b) => a * b;
const Div1 = (a, b) => (b !== 0 ? a / b : "Error: Division by zero");


 // Evaluate full expression safely
    function calculate(expression) {
      try {
        // Use Function constructor 
        return Function("return " + expression)();
      } catch {
        return "Error";
      }
    }

buttons.forEach(btn => {
      btn.addEventListener("click", function() {
        const value = this.textContent;
        if (value === "AC") {
          display.value = "";
        } else if (value === "=") {
          display.value = calculate(display.value);
        } else {
          display.value += value;
        }
      });
    });

 // Keyboard input handling
    document.addEventListener("keydown", function(event) {
      const allowedKeys = ["0","1","2","3","4","5","6","7","8","9",
                           "+","-","*","/","%",".","Enter","Backspace"];

      if (allowedKeys.includes(event.key)) {
        if (!isNaN(event.key) || ["+","-","*","/","%","."].includes(event.key)) {
          display.value += event.key;
        } else if (event.key === "Enter") {
          display.value = calculate(display.value);
        } else if (event.key === "Backspace") {
          display.value = display.value.slice(0, -1);
        }
      } else {
        alert("Invalid key pressed!");
        event.preventDefault(); // block invalid input
      }
    });