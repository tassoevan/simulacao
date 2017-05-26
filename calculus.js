const float = new Float32Array(1);
const int = new Int32Array(float.buffer);

// Smallest quantity around x
const δ = x => {
  float[0] = x;
  int[0]++;
  return float[0] - x;
};

// Smallest step to integrate/differentiate function f(x)
const h = f => x => Math.max(δ(f(x)), δ(x));

// Differential of f(x)
const d = f => x => f(x + h(f)(x)) - f(x);

// Derivative of f(x)
const D = f => x => (f(x + h(f)(x)) - f(x - h(f)(x)))/(2 * h(f)(x));
D.right = f => x => (f(x + h(f)(x)) - f(x))/h(f)(x);
D.left = f => x => (f(x) - f(x - h(f)(x)))/h(f)(x);

// Gradient of f(X), where X is a vector
// Evaluate derivatives of f'(x_i) = f(x_0, x_1, ..., x_i, ..., x_n)
const grad = f => X =>
  X.map((x, i) => D(x => f([...X.slice(0, i), x, ...X.slice(i + 1)]))(X[i]));

// Jacobian of F(X), where F(X) and X are vectors
const J = F => X => F.map(f => grad(f)(X));

module.exports = {
  δ,
  h,
  d,
  D,
  grad,
  J
};
