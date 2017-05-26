const calculus = require('./calculus.js');
const matrices = require('./matrices.js');

const context = {
  variables: {
    F1: 2,
    F2: 2.1,
    F3: 1
  },
  equations: [
    ({ F1 }) => F1 - 2,
    ({ F3 }) => F3 - 1,
    ({ F1, F2, F3 }) => F1 + F2 - F3
  ]
};

const error = context => x =>
  context.equations.map(equation => equation(x))
    .reduce((sum, error) => sum + error * error, 0);

const J = context => x => {
  const F = context.equations.map(
    equation => X => equation(
      Object.keys(x).reduce(
        (obj, k, i) => Object.assign(obj, { [k]: X[i] }), {}
      )
    )
  );
  const X = Object.keys(x).map(k => x[k]);
  return calculus.J(F)(X);
};

const solve = (context, maxIterations = 100, maxError = 1e-8) => {
  if (Object.keys(context.variables).length > context.equations.length) {
    throw new Error('many degrees of freedom');
  }

  const solution = Object.assign({}, context.variables);
  const variableNames = Object.keys(solution);

  let iterations = 0;
  do {
    if (iterations++ > maxIterations) {
      throw new Error('max iterations reached');
    }

    const jacobian = J(context)(solution);
    const invJacobian = matrices.inv(jacobian);
    const errors = context.equations.map(equation => equation(solution));
    const correction = matrices.apply(invJacobian, errors);

    variableNames.map((variableName, j) => {
        return solution[variableName] - correction[j];
      })
      .forEach((newValue, j) => {
        solution[variableNames[j]] = newValue;
      });
  }
  while(error(context)(solution) > maxError);

  return solution;
};

console.log('Error before:', error(context)(context.variables));
const solution = solve(context);
console.log(solution);
console.log('Error after:', error(context)(solution));
