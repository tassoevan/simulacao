const transpose = A => A[0].map((a, i) => A.map(Li => Li[i]));

const submatrix = (A, i, j) =>
  A.slice(0, i).map(Li => Li.slice(0, j).concat(Li.slice(j + 1)))
  .concat(
    A.slice(i + 1).map(Li => Li.slice(0, j).concat(Li.slice(j + 1)))
  );

const minor = (A, i, j) => det(submatrix(A, i, j));

const cofactor = (A, i, j) => Math.pow(-1, i + j) * minor(A, i, j);

const det = A =>
  A.length === 1 ?
    A[0][0] :
    A[0].reduce((sum, a, i) => sum + a * cofactor(A, 0, i), 0);

const comatrix = A =>
  A.map((Li, i) => Li.map((a, j) => cofactor(A, i, j)));

const scale = (A, α) =>
  A.map(Li => Li.map(a => α * a));

const apply = (A, v) =>
  A.map(Li => Li.reduce((sum, a, j) => sum + a * v[j], 0));

const inv = A => scale(comatrix(A), 1/det(A));

module.exports = {
  transpose,
  submatrix,
  minor,
  cofactor,
  det,
  comatrix,
  scale,
  apply,
  inv
};
