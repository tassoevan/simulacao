import System from './System';
import { expressionToString } from './utils.js';
const { PI, pow } = Math;

function dumpSystem(system) {
  console.log(`System (freedom degrees = ${system.freedom()})`);

  console.log('- Equations:');
  system.equations.forEach(equation => {
    console.log(`    ${expressionToString(equation)} = 0`);
  });

  console.log('- Indeterminates:');
  Object.keys(system.indeterminates).forEach(name => {
    const [ minValue, maxValue ] = system.indeterminates[name];
    console.log(`    ${name} in (${minValue}, ${maxValue})`);
  });

  console.log('- Parameters:');
  Object.keys(system.parameters).forEach(name => {
    const value = system.parameters[name];
    console.log(`    ${name} = ${value}`);
  });

  console.log();
}

const system = new System();
system
  .parameter('C', 1)
  .indeterminate('r', 0)
  .indeterminate('A', 0)
  .equation(({ C, r }) => C - 2 * PI * r)
  .equation(({ A, r }) => A - PI * pow(r, 2))
  ;
dumpSystem(system);

const X_guess = {
  r: 0,
  A: 0
};

console.log('Value: [' + system(X_guess).join(', ') + ']');

