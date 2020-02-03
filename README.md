# Rester.js
**Rester.js** is a RESTful HTTP client wrapper for the fetch API built with TypeScript. It ships ready for use with JSON APIs.

### Purpose
Apps that rely on RESTful APIs tend to repeat themselves when using API clients, like `fetch()`. **Rester.js** provides a layer over the fetch API that makes it easy to setup default behavior between calls. 

### Usage
Here is an example of how **Rester.js** can be used:  

```js
import { RESTfulClient } from 'rester-js'

// This will become the basis of all calls made with the instance of the RESTfulClient
const root = 'https://myapi.com/'

// Initialize the client with default values
const rester = new RESTfulClient(root, {
  // applies the Authorization header. Can also be set under a header secion in fetchOptions.
  authorization: 'Bearer jwttoken.string.forauth',

  // applies the Content-Type header. Can also be set under a header secion in fetchOptions.
  contentType: 'application/json',

  // will run after every successful request. Use the errorHandler option to run actions after failed requests.
  resolver: async res => await res.json(),

  // Options passed to the fetch api.
  // May be overwritten by authorization, contentType, or any options in the individual request.
  fetchOptions: {
    redirect: 'follow'
  }
});

// sends GET to "https://myapi.com/example?id=1&name=resource".
rester.get('example', { id: 1, name: 'resource' });

// sends POST request to "https://myapi.com/example" (fixes repeat slashes in route).
rester.post('/example', { id: 2, name: 'new resource' });

// sends PUT request to "https://myapi.com/example/3".
rester.put('example/3', { name: 'updated resource' });

// sends DELETE request to "https://myapi.com/example/4".
rester.delete('example/4');
```

Or, you might create a mapping of `RESTfulClient`s based on endpoints:  

```js
const endpointMapping = {
  myApp: new RESTfulClient(root, {
    // ...options...
  }),
  otherApp: new RESTfulClient('https://google.com', {
    // ...options...
  })
};

// sends GET to "https://myapi.com/example/5".
endpointMapping.myApp.get('example/5');
```

Each method also accepts an options object for the fetch API:
```js
rester.post('example', {name: 'resource' }, { 
  cache: 'no-cache',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})