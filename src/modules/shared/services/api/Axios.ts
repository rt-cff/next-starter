import getConfig from 'next/config'
import { stringify } from 'query-string'
import Axios from 'axios'

declare type RequestMethods = "get" | "GET" | "delete" | "DELETE" | "head" | "HEAD" | "options" | "OPTIONS" | "post" | "POST" | "put" | "PUT" | "patch" | "PATCH"

const { publicRuntimeConfig: { API_KEY } = { API_KEY: '' } }: { publicRuntimeConfig: { API_KEY: string } } = getConfig();
// const { publicRuntimeConfig: { API_KEY } = {} } = getConfig() || {};
let BaseUrl = `/api`


export const Http = {
  setBaseUrl: (url: string) => BaseUrl = url,
  request: async <A> (methodType: RequestMethods,
    url: string,
    params?: any,
    payload?: any): Promise<A> => {
    const query = params ? `?${stringify({ ...params, api_key: API_KEY })}` : ''

    return Axios(`${BaseUrl}${url}${query}`, {
      method: methodType,
      data: JSON.stringify(payload),
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${API_KEY}`
      }
    }).then(res => res.status === 200 ? res.data : Promise.reject(res.statusText))
      .catch(e => {
        throw e;
      });
  }
};