// src/libs/getSearchParams.js
export function getSearchParams(segment) {
  console.log('getSearchParams called with segment:', segment);

  if (!segment) {
    console.log('Empty segment, returning empty object');
    return {};
  }

  const searchParams = {};

  const paramsString = segment.split('?')[1];
  console.log('Extracted params string:', paramsString);

  if (paramsString) {
    paramsString.split('&').forEach((param) => {
      const [key, value] = param.split('=');
      searchParams[key] = value;
      console.log(`Parsed param: ${key} = ${value}`);
    });
  }

  console.log('Returning searchParams:', searchParams);
  return searchParams;
}
