// getSearchParams.js
import { parse } from 'url';

export function getSearchParams(req) {
  const { query } = parse(req.url, true);
  return query;
}
