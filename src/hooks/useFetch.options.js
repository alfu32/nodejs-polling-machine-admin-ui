export const options = {
  // accepts all `fetch` options such as headers, method, etc.

  // The time in milliseconds that cache data remains fresh.
  cacheLife: 0,

  // Cache responses to improve speed and reduce amount of requests
  // Only one request to the same endpoint will be initiated unless cacheLife expires for 'cache-first'.
  cachePolicy: 'no-cache', // 'cache-first', 'no-cache'
  
  // set's the default for the `data` field
  data: [],

  // typically, `interceptors` would be added as an option to the `<Provider />`
  interceptors: {
    request: async ({ options, url, path, route }) => { // `async` is not required
      return options // returning the `options` is important
    },
    response: async ({ response }) => {
      // note: `response.data` is equivalent to `await response.json()`
      return response // returning the `response` is important
    }
  },

  // set's the default for `loading` field
  loading: false,
  
  // called when aborting the request
  onAbort: () => {},
  
  // runs when an error happens.
  onError: ({ error }) => {},

  // this will allow you to merge the `data` for pagination.
  onNewData: (currData, newData) => {
    return [...currData, ...newData] 
  },
  
  // called when the request times out
  onTimeout: () => {},
  
  // this will tell useFetch not to run the request if the list doesn't haveMore. (pagination)
  // i.e. if the last page fetched was < 15, don't run the request again
  perPage: 15,

  // Allows caching to persist after page refresh. Only supported in the Browser currently.
  persist: false,

  // this would basically call `await response.json()`
  // and set the `data` and `response.data` field to the output
  responseType: 'json',
  // OR can be an array. It's an array by default.
  // We will try to get the `data` by attempting to extract
  // it via these body interface methods, one by one in
  // this order. We skip `formData` because it's mostly used
  // for service workers.
  responseType: ['json', 'text', 'blob', 'arrayBuffer'],

  // amount of times it should retry before erroring out
  retries: 3,

  // The time between retries
  retryDelay: 10000,
  // OR
  // Can be a function which is used if we want change the time in between each retry
  retryDelay({ attempt, error, response }) {
    // exponential backoff
    return Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000)
    // linear backoff
    return attempt * 1000
  },


  // make sure `retries` is set otherwise it won't retry
  // can retry on certain http status codes
  retryOn: [503],
  // OR
  async retryOn({ attempt, error, response }) {
    // retry on any network error, or 4xx or 5xx status codes
    if (error !== null || response.status >= 400) {
      console.log(`retrying, attempt number ${attempt + 1}`);
      return true;
    }
  },

  // enables experimental React Suspense mode
  suspense: true, // defaults to `false`
  
  // amount of time before the request get's canceled/aborted
  timeout: 10000,
}