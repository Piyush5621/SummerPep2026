function sanitizeQuery(input) {
  if (typeof input !== 'string') {
    return { clean: '', flagged: true, reason: 'Input must be a string.' };
  }

  const normalized = input.trim();
  if (!normalized) {
    return { clean: '', flagged: true, reason: 'Empty input.' };
  }

  const suspiciousPatterns = [
    /ignore\s+(previous|all|prior)\s+instructions?/i,
    /reveal\s+(the\s+)?(system|hidden|secret)\s+(prompt|instructions?)/i,
    /act\s+as\s+(an?|the)\s+/i,
    /you\s+are\s+(now|an?)\s+/i,
    /override/i,
    /bypass/i,
    /developer\s+mode/i,
  ];

  const flagged = suspiciousPatterns.some((pattern) => pattern.test(normalized));
  const clean = flagged ? '[filtered]' : normalized;

  return { clean, flagged, reason: flagged ? 'Suspicious instruction-like wording detected.' : 'Safe input.' };
}

function validateResponse(output) {
  if (typeof output !== 'string') {
    return { safe: false, response: 'I could not safely answer that question.' };
  }

  const blockedPatterns = [
    /system\s+prompt/i,
    /developer\s+mode/i,
    /ignore\s+(previous|all|prior)\s+instructions?/i,
    /reveal\s+(the\s+)?(system|hidden|secret)\s+(prompt|instructions?)/i,
    /act\s+as\s+(an?|the)\s+/i,
    /override/i,
    /bypass/i,
  ];

  const safe = !blockedPatterns.some((pattern) => pattern.test(output));

  return {
    safe,
    response: safe ? output : 'I could not safely answer that question.'
  };
}

module.exports = { sanitizeQuery, validateResponse };
