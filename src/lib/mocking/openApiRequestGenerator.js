const _ = require('lodash')
// const fs = require('fs')
// const jref = require('json-ref-lite')
// const yaml = require('js-yaml')
const faker = require('faker')
const jsf = require('json-schema-faker')
const $RefParser = require('json-schema-ref-parser')
const util = require('util')

jsf.format('byte', () => Buffer.alloc(faker.lorem.sentence(12)).toString('base64'))

jsf.option({
  alwaysFakeOptionals: true,
  ignoreMissingRefs: true,
  maxItems: 2
})
jsf.extend('faker', () => require('faker'))

const ajv = require('ajv')({
  unknownFormats: 'ignore'
})

async function loadYamlFile (fn) {
  // let tree = yaml.safeLoad(fs.readFileSync(fn, 'utf8'))
  let tree = await $RefParser.parse(fn)

  // Add keys to schemas
  if (tree.components && tree.components.schemas) {
    Object.keys(tree.components.schemas).forEach(k => {
      tree.components.schemas[k].key = k
    })
  }

  // Add parameters to methods
  _.forEach(tree.paths, (o, routePath) => {
    const params = o.parameters || []
    _.forEach(o, (defn, httpMethod) => {
      if (httpMethod === 'parameters') {
        return
      }

      defn.parameters = params.concat(defn.parameters || [])
    })
  })

  // Resolve $refs
  // tree = jref.resolve(tree)
  tree = await $RefParser.dereference(tree)

  // Merge all "allOf"
  if (tree.components && tree.components.schemas) {
    Object.keys(tree.components.schemas).forEach(k => {
      const schema = tree.components.schemas[k]

      if (schema.properties) {
        Object.keys(schema.properties).forEach(k => {
          const prop = schema.properties[k]

          if (prop.allOf) {
            schema.properties[k] = Object.assign({}, ...prop.allOf)
          }
        })
      }
    })
  }

  // Validate all endpoint schemas
  if (tree.paths) {
    _.forEach(tree.paths, (methodMap, routePath) => {
      _.forEach(methodMap, (operation, method) => {
        if (method === 'parameters' || method.startsWith('x-')) {
          return
        }

        const reqSchema = findRequestSchema(operation.requestBody)
        if (reqSchema) {
          operation.validateRequest = ajv.compile(reqSchema)
        }
        const resSchema = findResponseSchema(operation.responses)
        if (resSchema) {
          operation.validateResponse = ajv.compile(resSchema)
        }
      })
    })
  }

  return tree
}

const findResponseSchema = (r) => {
  const successCode = _.find(r, (v, k) => k >= 200 && k <= 299)
  const content = successCode ? successCode.content : null
  if (content == null || Object.entries(content).length === 0) {
    return null
  }
  // Get first object by key.
  return _.find(content).schema
}

const findRequestSchema = (r) => {
  const { content } = r || {}
  if (content == null) {
    return null
  }
  return _.find(content).schema
}

const generateMockResponseBody = async (method, name, data, jsfRefs) => {
  const responseSchema = findResponseSchema(data.responses)
  // Create a new copy of object without copying by references
  const newResponseSchema = JSON.parse(JSON.stringify(responseSchema))
  jsfRefs.forEach(ref => {
    const convertedId = ref.id.replace(/\./g, '.properties.')
    const targetObject = _.get(newResponseSchema.properties, convertedId)
    if (targetObject) {
      targetObject.$ref = ref.id
      if (ref.pattern) {
        delete targetObject.pattern
        delete targetObject.enum
      }
    }
  })

  if (newResponseSchema == null) {
    return {}
  }

  const fakedResponse = {}
  fakedResponse.body = await jsf.resolve(newResponseSchema, jsfRefs)
  for (const key in data.responses) {
    if (key >= 200 && key <= 299) {
      fakedResponse.status = key
      break
    }
    // Just in-case
    fakedResponse.status = key
  }
  return fakedResponse
}

const generateMockOperation = async (method, name, data, jsfRefs) => {
  const requestSchema = findRequestSchema(data.requestBody)
  // Create a new copy of object without copying by references
  const newRequestSchema = JSON.parse(JSON.stringify(requestSchema))
  jsfRefs.forEach(ref => {
    const convertedId = ref.id.replace(/\./g, '.properties.')
    const targetObject = _.get(newRequestSchema.properties, convertedId)
    if (targetObject) {
      targetObject.$ref = ref.id
      if (ref.pattern) {
        delete targetObject.pattern
        delete targetObject.enum
      }
    }
  })

  if (newRequestSchema == null) {
    return {}
  }

  const fakedResponse = await jsf.resolve(newRequestSchema, jsfRefs)

  return fakedResponse
}

const generateMockHeaders = async (method, name, data, jsfRefs) => {
  const headers = {}
  data.parameters.forEach(param => {
    if (param.in === 'header') {
      if (param.schema.type) {
        headers[param.name] = { type: param.schema.type }
      } else {
        headers[param.name] = {}
      }
    }
  })
  jsfRefs.forEach(ref => {
    if (headers[ref.id]) {
      headers[ref.id] = { $ref: ref.id }
    }
  })

  if (headers === {}) {
    return {}
  }

  const fakedResponse = await jsf.resolve(headers, jsfRefs)

  return fakedResponse
}

class OpenApiRequestGenerator {
  constructor () {
    this.schema = {}
  }

  async load (schemaPath) {
    this.schema = await loadYamlFile(schemaPath)
  }

  async generateRequestBody (path, httpMethod, jsfRefs) {
    const pathValue = this.schema.paths[path]
    const operation = pathValue[httpMethod]
    const id = operation.operationId || operation.summary
    return generateMockOperation(httpMethod, id, operation, jsfRefs)
  }

  async generateRequestHeaders (path, httpMethod, jsfRefs) {
    const pathValue = this.schema.paths[path]
    const operation = pathValue[httpMethod]
    const id = operation.operationId || operation.summary
    return generateMockHeaders(httpMethod, id, operation, jsfRefs)
  }

  async generateResponseBody (path, httpMethod, jsfRefs) {
    const pathValue = this.schema.paths[path]
    const operation = pathValue[httpMethod]
    const id = operation.operationId || operation.summary

    return generateMockResponseBody(httpMethod, id, operation, jsfRefs)
  }
}

module.exports = OpenApiRequestGenerator
