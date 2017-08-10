
class ApiClient {
  constructor (passedConfig) {
    const baseConfig = {
      bodyEncoder: JSON.stringify,
      credentials: 'same-origin',
      format: 'json',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      methods: ['get', 'post', 'put', 'patch', 'delete']
    }

    if (!passedConfig.basePath) {
      // e.g. 'https://example.com/api/v3'
      throw new Error('You must pass a base path to the ApiClient')
    }

    const methods = passedConfig.methods || baseConfig.methods
    methods.forEach((method) => {
      this[method] = (path, { params, data, fetchConfig } = {}) => {
        const config = {
          ...baseConfig,
          ...passedConfig,
          ...fetchConfig,
          headers: {
            ...baseConfig.headers,
            ...(passedConfig ? passedConfig.headers : {}),
            ...(fetchConfig ? fetchConfig.headers : {})
          }
        }
        const {
          methods: _methods, basePath, headers, format, bodyEncoder,
          ...otherConfig
        } = config
        const queryString = this.serialize(params).indexOf('&') > 0 ? `?${this.serialize(params)}` : ''

        const requestPath = basePath + path + queryString
        const body = data ? bodyEncoder(data) : undefined

        return fetch(requestPath, {
          ...otherConfig,
          method,
          headers,
          body
        }).then(response => ({ response, format }))
          .then(this.handleErrors)
          .then(response => response[format]())
      }
    })
  }

  serialize (obj, prefix) {
    return Object.keys(obj).map((key) => {
      const k = !prefix ? key : prefix
      const v = obj[key]
      return (v !== null && typeof v === 'object') ?
        this.serialize(v, k) : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
    }).join('&')
  }

  /* eslint-disable class-methods-use-this */
  handleErrors ({ response, format }) {
    if (!response.ok) {
      return response[format]()
      // if response parsing failed send back the entire response object
        .catch(() => {
          throw response
        })
        // else send back the parsed error
        .then((parsedErr) => {
          throw parsedErr
        })
    }
    return response
  }
}

export default ApiClient
