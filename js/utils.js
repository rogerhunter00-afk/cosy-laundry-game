function pickWeighted(arr, key) {
  if (!Array.isArray(arr) || arr.length === 0) return null;

    const getWeight = (it) => {
      const raw = it && it[key];
      if (typeof raw !== 'number') return 0;
      return Number.isFinite(raw) && raw > 0 ? raw : 0;
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
