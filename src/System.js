const X_prime = (X, system) => ({
  ...system.parameters,
  //todo: specifications
  //todo: perturbations
  ...X
});

export default class System extends Function {
  constructor() {
    const instance = X => instance.eval(X);
    Object.setPrototypeOf(instance, System.prototype);

    instance.indeterminates = {};
    instance.parameters = {};
    instance.specifications = [];
    instance.perturbations = [];
    instance.equations = [];

    return instance;
  }

  indeterminate(name, minValue = Number.MIN_VALUE, maxValue = Number.MAX_VALUE) {
    this.indeterminates[name] = [ minValue, maxValue ];
    return this;
  }

  parameter(name, value) {
    this.parameters[name] = value;
    return this;
  }

  specification(name) {
    this.specifications.push(name);
    return this;
  }

  perturbation(name) {
    this.perturbations.push(name);
    return this;
  }

  equation(eq) {
    this.equations.push(eq);
    return this;
  }

  freedom() {
    return Object.keys(this.indeterminates).length - this.equations.length;
  }

  eval(X) {
    return this.equations.map(equation => equation(X_prime(X, this)));
  }
}
