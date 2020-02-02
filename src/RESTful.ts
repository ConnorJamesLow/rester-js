export default class RESTfulClient {
  /**
   * The Root URL of all api requests made with this instance.
   */
  root: string

  /**
   * A string (or function resolving to a string) that may be used as the Authorization header.
   */
  authorization: string | AuthorizationResolver

  /**
   * A string that may be used as the default content type.  
   * May be overwritten with the `fetchOptions` property.
   */
  contentType: string

  /**
   * Options to apply to all fetch API calls.  
   * These are overwritten by `contentType`, `authorization`, and any call specific options passed for the fetch API.
   */
  fetchOptions: any

  /**
   * A default action to take on all successful responses, e.g. run `response.json()`.
   */
  resolver: (response: Response) => Promise<any> | any

  /**
   * A Default action to take when the status code not successful.
   */
  errorHandler: (code: number, response: Response) => void

  /**
   * Create a new Rester instance.
   * @param root The Root URL of all api requests made with this instance.
   * @param options Specify defaults for the Rester instance.
   */
  constructor(root: string, options?: ResterOptions) {
    this.root = root;
    this.authorization = options?.authorization || '';
    this.contentType = options?.contentType || 'application/json'
    this.resolver = options?.resolver || (async (res) => await res.json());
    this.errorHandler = options?.errorHandler || console.error;
    this.fetchOptions = {};
  }

  /**
   * Get the authorization header.
   */
  getAuthorization() {
    const { authorization } = this;
    if (typeof authorization === typeof '') {
      return authorization as string;
    }
    return (authorization as AuthorizationResolver)();
  }

  /**
   * Create an HTTP request using the fetch API.
   * @param url The absolute path to the request endpoint.
   * @param options Additional options for the fetch API. These override all other options.
   */
  async request(url: string | URL, options: any = {}) {
    const response = await fetch(url.toString(), {
      ...this.fetchOptions,
      ...options,
      headers: {
        ...this.fetchOptions?.headers,
        'Content-Type': this.contentType,
        'Authorization': this.getAuthorization(),
        ...options?.headers,
      }
    });
    return await this.resolve(response);
  }

  /**
   * Sends a GET request.
   * @param uri The relative-to-the-root path to the request endpoint.
   * @param query An object to convert into a querystring.
   * @param options Additional options for the fetch API. These override all other options.
   */
  async get(uri: string, query: any = {}, options = {}) {
    const url = this.createURL(uri);
    Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));
    return await this.request(url, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * Sends a POSI request.
   * @param uri The relative-to-the-root path to the request endpoint.
   * @param body A JSON serializable object to convert into the request body. Uses JSON.stringify on non-string objects.
   * @param options Additional options for the fetch API. These override all other options.
   */
  async post(uri: string, body: any, options = {}) {
    const url = this.createURL(uri);
    return await this.request(url, {
      body: typeof body === 'string'
        ? body
        : JSON.stringify(body),
      ...options,
      method: 'POST',
    });
  }

  /**
   * Sends a DELETE request.
   * @param uri The relative-to-the-root path to the request endpoint.
   * @param options Additional options for the fetch API. These override all other options.
   */
  async delete(uri: string, options = {}) {
    const url = this.createURL(uri);
    return await this.request(url, {
      ...options,
      method: 'DELETE',
    });
  }

  /**
   * Sends a POST request.
   * @param uri The relative-to-the-root path to the request endpoint.
   * @param body A JSON serializable object to convert into the request body. Uses JSON.stringify on non-string objects.
   * @param options Additional options for the fetch API. These override all other options.
   */
  async put(uri: string, body: any, options = {}) {
    const url = this.createURL(uri);

    // convert query object to url query parameters.
    return await this.request(url, {
      body: JSON.stringify(body),
      ...options,
      method: 'PUT',
    });
  }

  async resolve(response: Response) {
    if (response.status >= 400) {
      this.errorHandler(response.status, response);
      return response;
    }
    return await this.resolver(response);
  }

  /**
   * Create a URL relative to the request root.
   * @param resourceUri The request path, relative to the API root.
   */
  createURL(resourceUri: string) {
    return new URL(`${this.root}/${resourceUri}`.replace(/([^:])[\\/]+/g, '$1/'));
  }
}
