const calculus = require('./calculus.js');

const context = {
  variables: {
    F1: 2,
    F2: 1,
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

const grad = (f, context) => x => {
  const float = new Float32Array(1);
  const int = new Int32Array(float.buffer);

  return Object.keys(context.variables).map(variableName => {
      const x_ = Object.assign({}, x);
      float[0] = x[variableName];
      int[0]++;
      x_[variableName] = float[0];
      return (f(x_) - f(x))/(x_[variableName] - x[variableName]);
    });
};

const J = context => x => {
  const F = context.equations.map(
    equation => X => equation(
      Object.keys(x).reduce(
        (obj, k, i) => Object.assign(obj, { [k]: X[i] }), {}
      )
    )
  );
  const X = Object.keys(x).map(k => x[k]);
  console.log(calculus.J(F)(X));
  return calculus.J(F)(X);
}

const submatrix = (matrix, i, j) =>
  matrix.slice(0, i)
    .map(line => line.slice(0, j).concat(line.slice(j + 1)))
    .concat(
      matrix.slice(i + 1)
        .map(line => line.slice(0, j).concat(line.slice(j + 1)))
    )
;

const minor = (matrix, i, j) => det(submatrix(matrix, i, j));

const cofactor = (matrix, i, j) =>
  ((i + j) % 2 === 0 ? 1: -1) * minor(matrix, i, j);

const det = matrix => {
  if (matrix.length === 1) {
    return matrix[0][0];
  }
  else {
    return matrix[0].reduce((sum, a, i) => {
      return sum + a * cofactor(matrix, 0, i);
    }, 0);
  }
};

const comatrix = matrix =>
  matrix.map((line, i) => line.map((a, j) => cofactor(matrix, i, j)));

const inv = matrix => {
  const determinant = det(matrix);
  if (determinant === 0) {
    throw new Error('singular matrix');
  }

  const C = comatrix(matrix);

  return C.map((line, i) => line.map((a, j) => C[j][i]/determinant));
};

const apply = (matrix, vector) =>
  matrix.map(line => line.reduce((sum, a, i) => sum + line[i] * vector[i], 0));

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
    console.log(jacobian);
    const invJacobian = inv(jacobian);
    const errors = context.equations.map(equation => equation(solution));
    const correction = apply(invJacobian, errors);

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
