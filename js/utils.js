function pickWeighted(arr, key) {
  if (!Array.isArray(arr) || arr.length === 0) return null;

  const valid = [];
  for (const it of arr) {
    const w = it[key];
    if (typeof w !== 'number' || !Number.isFinite(w) || w < 0) {
      continue; // Skip invalid weights
    }
    valid.push(it);
  }

  if (valid.length === 0) return null;

  const total = valid.reduce((sum, item) => sum + item[key], 0);
  if (total <= 0) return null;

  let r = Math.random() * total;
  for (const it of valid) {
    r -= it[key];
    if (r <= 0) return it;
  }
  return valid[valid.length - 1];
}

if (typeof module !== 'undefined') {
  module.exports = { pickWeighted };
}

if (typeof window !== 'undefined') {
  window.pickWeighted = pickWeighted;
}
