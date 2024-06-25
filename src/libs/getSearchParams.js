// src/libs/getSearchParams.js
export function getSearchParams(segment) {
  if (!segment) return {};
  const searchParams = {};
  segment.split('?')[1]?.split('&').forEach((param) => {
    const [key, value] = param.split('=');
    searchParams[key] = value;
  });
  return searchParams;
}
