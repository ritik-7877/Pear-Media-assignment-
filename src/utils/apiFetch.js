/**
 * Safe API fetch wrapper.
 * - Handles network errors (server down / ECONNREFUSED via proxy)
 * - Safely parses JSON; surfaces raw text if the response isn't JSON
 * - Throws a user-friendly Error in all failure cases
 */
export async function apiFetch(url, options = {}) {
  let res;
  try {
    res = await fetch(url, options);
  } catch (networkErr) {
    // fetch() itself threw — server is unreachable
    throw new Error(
      'Cannot reach the API server. Make sure the Express server is running on port 3001 (npm run dev:server).'
    );
  }

  // Try to parse as JSON regardless of status
  let data;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      data = await res.json();
    } catch {
      throw new Error(`Server returned malformed JSON (HTTP ${res.status}).`);
    }
  } else {
    // Non-JSON response (e.g. HTML error page from proxy)
    const text = await res.text().catch(() => '');
    throw new Error(
      `Server returned an unexpected response (HTTP ${res.status}). ` +
      (text.length < 200 ? text : text.slice(0, 200) + '…')
    );
  }

  if (!res.ok || !data.success) {
    throw new Error(data?.error || `Request failed with status ${res.status}.`);
  }

  return data;
}
