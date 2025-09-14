function pickWeighted(arr, key) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  const total = arr.reduce((a, b) => a + b[key], 0);
  if (total <= 0) return null;
  let r = Math.random() * total;
  for (const it of arr) {
    r -= it[key];
    if (r <= 0) return it;
  }
  return arr[arr.length - 1];
}

if (typeof module !== 'undefined') {
  module.exports = { pickWeighted };
}

if (typeof window !== 'undefined') {
  window.pickWeighted = pickWeighted;
}
