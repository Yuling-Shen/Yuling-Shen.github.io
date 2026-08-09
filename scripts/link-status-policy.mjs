export function isAcceptedLinkStatus(status) {
  return (
    (status >= 200 && status < 400) ||
    status === 401 ||
    status === 403 ||
    status === 429
  );
}
