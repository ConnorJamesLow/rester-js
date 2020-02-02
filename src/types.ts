/**
 * A function that returns a string representing an authorization header.
 */
type AuthorizationResolver = () => string

/**
 * Specify defaults for the Rester instance.
 */
type ResterOptions = {
  /**
   * A string (or function resolving to a string) that may be used as the Authorization header.
   */
  authorization?: string | AuthorizationResolver,

  /**
   * A string that may be used as the default content type.  
   * Defaults to `application/json`.
   */
  contentType?: string

  /**
   * A default action to take on all successful responses, e.g. run `response.json()`.
   */
  resolver?: (response: Response) => any

  /**
   * A Default action to take when the status code not successful.
   */
  errorHandler?: (code: number, response: Response) => void

  /**
   * Options to apply to all fetch API calls.
   */
  fetchOptions?: {}
}