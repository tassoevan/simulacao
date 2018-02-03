export default class System {
  constructor() {
    this.indeterminates = {};
    this.parameters = {};
    this.specifications = [];
    this.perturbations = [];
    this.equations = [];
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

  equation(left, right) {
    this.equations.push(V => left(V) - right(V));
    return this;
  }
}
