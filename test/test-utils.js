export const testAsync = (asserts, done) => () => {
  try {
    asserts();
  } catch (e) {
    return done(e);
  }
};
