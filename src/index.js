import System from './System';
import chalk from 'chalk';

const system = new System();
system.parameter('C', 1)
  .parameter('pi', Math.PI)
  .indeterminate('r', 0)
  .equation(({ C }) => C, ({ pi, r }) => 2 * pi * r);

