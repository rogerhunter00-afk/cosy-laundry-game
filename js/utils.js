function pickWeighted(arr, key) {
  if (!Array.isArray(arr) || arr.length === 0) return null;

  const getWeight = (it) => {
    const w = Number(it && it[key]);
    return Number.isFinite(w) && w > 0 ? w : 0;
  };

  const total = arr.reduce((sum, it) => sum + getWeight(it), 0);
  if (total <= 0) return null;

  let r = Math.random() * total;
  let lastValid = null;
  for (const it of arr) {
    const w = getWeight(it);
    if (w === 0) continue;
    lastValid = it;
    r -= w;
    if (r <= 0) return it;
  }
  return lastValid;
}

if (typeof module !== 'undefined') {
  module.exports = { pickWeighted };
}

if (typeof window !== 'undefined') {
  window.pickWeighted = pickWeighted;
}
