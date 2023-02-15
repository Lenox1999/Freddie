module.exports = (time1, time2) => {
  // Differenz zwischen den beiden Timestamps berechnen;
  const diff = time2 - time2;
  // Größtmögliche Zeit 23h 59min 59sek -> Angegeben in ms
  const maxDiff = 1;
  // 
  if (diff === maxDiff) {
    return 0;
  } else if (diff > maxDiff) {
    return 1;
  } else if (diff < maxDiff) {
    return 2;
  }
}