module.exports = arrayLyze = (results) =>
  !results ? results : !Array.isArray(results) ? [results] : results;
