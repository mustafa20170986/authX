export default async function Authfetch(
  url: string,
  opts: RequestInit = {},
): Promise<Response> {
  const access_token = localStorage.getItem('access_token');

  const getHeaders = (token: string | null) => ({
    'Content-Type': 'applciation/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  });

  let response = await fetch(url, {
    ...options,
    headers: { getHeaders },
  });
  if (response.status === '401') {
    const reftoken = localStorage.getItem('refresh_token');
    if (!reftoken) {
      handlelougout();
    }
    //fetch the new refresh token
    try {
      const res = await fetch('http://localhost:2017/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reftoken }),
      });
      if (!res.ok) {
        throw new Error('failed to refresht token');
      }
      const data = await res.json();
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);

      // Retry original request with new access token
      response = await fetch(url, {
        ...options,
        headers: getHeaders(data.accessToken),
      });
    } catch (error) {
      handlelougout();
      console.log(error);
    }
  }
  return response;
}
function handlelougout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/home';
}
