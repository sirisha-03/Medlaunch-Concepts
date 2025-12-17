// ---------- Small helpers (and minimal "self tests") ----------
export function isoToUS(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${m}/${d}/${y}`;
}

export function isoToDDMMYYYY(iso) {
  // NOTE: despite the name, this now returns MM/DD/YYYY so the app uses
  // a consistent US-style format everywhere.
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${m}/${d}/${y}`;
}

export function formatBytes(bytes) {
  if (bytes === null || bytes === undefined) return "";
  const units = ["B", "KB", "MB", "GB"];
  let b = bytes;
  let i = 0;
  while (b >= 1024 && i < units.length - 1) {
    b /= 1024;
    i += 1;
  }
  return `${b.toFixed(i === 0 ? 0 : 1)}${units[i]}`;
}

// Self tests
(function runSelfTests() {
  try {
    const t1 = isoToUS("2025-01-31") === "01/31/2025";
    const t2 = formatBytes(0) === "0B";
    const t3 = formatBytes(1024) === "1.0KB";
    if (!t1 || !t2 || !t3) {
      console.warn("Self-tests failed:", { t1, t2, t3 });
    }
  } catch (e) {
    console.warn("Self-tests threw:", e);
  }
})();
