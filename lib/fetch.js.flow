import fetch from 'whatwg-fetch'

const assign = Object.assign

/**
 * Private utils
 */
function isObject (obj) {
  // {} Not null
  return obj && Object.prototype.toString.call(obj) === '[object Object]' && Object.keys(obj).length !== 0
  // return obj && typeof obj === 'object'
}

function isJsonType (contentType) {
  return contentType && contentType.indexOf('application/json') === 0
}

function stringify (obj) {
  return Object.keys(obj).map(key => (`${key} = ${obj[key]}`)).join('&')
}

function isNode () {
  return Object.prototype.toString.call(process) === '[object Object]' && process.title === 'node'
}

/**
 * Request
 */
class Request {
  constructor (method, url, opts = {}) {
    if (Object.prototype.toString.call(url) !== '[object String]') {
      throw new TypeError('invalid url')
    }

    this.options = assign({}, {
      method: 'get',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      headers: {},
      query: {}
    }, opts)
    const options = this.options

    const prefix = options.prefix || ''
    this.url = prefix + url

    options.method = method

    // fetch will normalize the headers
    const headers = options.headers
    Object.keys(headers).forEach((h, index) => {
      if (h !== h.toLowerCase()) {
        headers[h.toLowerCase()] = headers[h]
        delete headers[h]
      }
    })
  }

  /**
   * Set Options
   *
   * Examples:
   *
   *   .config('credentials', 'omit')
   *   .config({ credentials: 'omit' })
   *
   * @param {String|Object} key
   * @param {Any} value
   * @return {Request}
   */
  config (key, value) {
    const options = this.options

    if (Object.prototype.toString.call(key) === '[object Object]') {
      Object.keys(key).forEach((k, index) => {
        options[k] = key[k]
      })
    } else {
      options[key] = value
    }

    return this
  }

  /**
   * Set header
   *
   * Examples:
   *
   *   .header('Accept', 'application/json')
   *   .header({ Accept: 'application/json' })
   *
   * @param {String|Object} key
   * @param {String} value
   * @return {Request}
   */
  header (key, value) {
    const headers = this.options.headers

    if (Object.prototype.toString.call(key) === '[object Object]') {
      Object.keys(key).forEach((k, index) => {
        headers[k.toLowerCase()] = key[k]
      })
    } else {
      headers[key.toLowerCase()] = value
    }

    return this
  }

  /**
   * Set Content-Type
   *
   * @param {String} type
   */
  type (type) {
    let newType
    switch (type) {
      case 'json':
        newType = 'application/json'
        break
      case 'form':
      case 'urlencoded':
        newType = 'application/x-www-form-urlencoded'
        break
      default:
        newType = 'application/json'
        break
    }

    this.options.headers['content-type'] = newType

    return this
  }

  /**
   * Add query string
   *
   * @param {Object} object
   * @return {Request}
   */
  query (object) {
    const query = this.options.query

    Object.keys(object).forEach((k, index) => {
      query[k] = object[k]
    })

    return this
  }

  /**
   * Send data
   *
   * Examples:
   *
   *   .send('name=hello')
   *   .send({ name: 'hello' })
   *
   * @param {String|Object} data
   * @return {Request}
   */
  send (data) {
    let type = this.options.headers['content-type']

    if (isObject(data) && isObject(this.sendBody)) {
      // merge body
      Object.keys(data).forEach((k, index) => {
        this.sendBody[k] = data[k]
      })
      // for (let key in data) {
      //   this.sendBody[key] = data[key]
      // }
    } else if (Object.prototype.toString.call(data) === '[object String]') {
      if (!type) {
        type = 'application/x-www-form-urlencoded'
        this.options.headers['content-type'] = type
      }

      if (type.indexOf('x-www-form-urlencoded') !== -1) {
        this.sendBody = this.sendBody ? `${this.sendBody}&${data}` : data
      } else {
        this.sendBody = (this.sendBody || '') + data
      }
    } else {
      this.sendBody = data
    }

    // default to json
    if (!type) {
      this.options.headers['content-type'] = 'application/json'
    }

    return this
  }

  /**
   * Append formData
   *
   * Examples:
   *
   *   .append(name, 'hello')
   *
   * @param {String} key
   * @param {String} value
   * @return {Request}
   */
  append (key, value) {
    if (!(this.sendBody instanceof window.FormData)) {
      this.sendBody = new window.FormData()

      if (isNode()) {
        const headers = this.sendBody.getHeaders()
        if (headers && headers['content-type']) {
          this.options.headers['content-type'] = headers['content-type']
        }
      }
    }

    this.sendBody.append(key, value)

    return this
  }

  promise () {
    const { options } = this
    let { url } = this

    const {
      beforeRequest,
      afterResponse
    } = options

    try {
      if (['GET', 'HEAD', 'OPTIONS'].indexOf(options.method.toUpperCase()) === -1) {
        if (this.sendBody instanceof FormData) {
          options.body = this.sendBody
        } else if (isObject(this.sendBody) && isJsonType(options.headers['content-type'])) {
          options.body = JSON.stringify(this.sendBody)
        } else if (isObject(this.sendBody)) {
          options.body = stringify(this.sendBody)
        } else {
          options.body = this.sendBody
        }
      } else {
        delete options.headers['content-type']
      }

      if (isObject(options.query)) {
        if (url.indexOf('?') >= 0) {
          url += `&${stringify(options.query)}`
        } else {
          url += `?${stringify(options.query)}`
        }
      }

      if (beforeRequest) {
        const canceled = beforeRequest(url, options.body)
        if (canceled === false) {
          return Promise.reject(new Error('request canceled by beforeRequest'))
        }
      }
    } catch (e) {
      return Promise.reject(e)
    }

    if (afterResponse) {
      return fetch(url, options)
        .then((res) => {
          afterResponse(res)
          return res
        })
    }

    return fetch(url, options)
  }

  then (resolve, reject) {
    return this.promise().then(resolve, reject)
  }

  catch (reject) {
    return this.promise().catch(reject)
  }

  json (strict = true) {
    return this.promise()
      .then(res => res.json())
      .then((json) => {
        if (strict && !isObject(json)) {
          throw new TypeError('response is not strict json')
        }

        if (this.options.afterJSON) {
          this.options.afterJSON(json)
        }

        return json
      })
  }

  text () {
    return this.promise().then(res => res.text())
  }
}

/**
 * Fetch
 */
function Fetch (options) {
  if (!(this instanceof Fetch)) {
    return new Fetch(options)
  }

  this.options = options || {}
}

const methods = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch']

methods.forEach((method) => {
  this[method] = (url) => {
    const opts = assign({}, this.options)
    return new Request(method, url, opts)
  }
})

/**
 * export
 */
module.exports = Fetch
