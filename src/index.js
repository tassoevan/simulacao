import System from './System';
import { expressionToString } from './utils.js';
const { pow } = Math;

const system = new System();
system.parameter('C', 1)
  .parameter('pi', Math.PI)
  .indeterminate('r', 0)
  .indeterminate('A', 0)
  .equation(({ C, pi, r }) => C - 2 * pi * r)
  .equation(({ pi, r }) => pi * pow(r, 2))
  ;

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
