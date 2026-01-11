(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/v1/health');
    const json = await res.json();
    console.log('Health:', res.status, json);
  } catch (err) {
    console.error('Health check failed:', err && err.message ? err.message : err);
  }
})();