/*****
 License
 --------------
 Copyright © 2017 Bill & Melinda Gates Foundation
 The Mojaloop files are made available by the Bill & Melinda Gates Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Gates Foundation organization for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.
 * Gates Foundation

 * ModusBox
 * Vijaya Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/

const _ = require('lodash')
// const fs = require('fs')
// const jref = require('json-ref-lite')
// const yaml = require('js-yaml')
const faker = require('faker')
const jsf = require('json-schema-faker')
const $RefParser = require('json-schema-ref-parser')

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

  if (!newResponseSchema) {
    return {}
  }
  jsfRefs.forEach(ref => {
    const convertedId = ref.id.replace(/\.(?!items)/g, '.properties.')

    const targetObject = _.get(newResponseSchema.type === 'array' ? newResponseSchema.items.properties : newResponseSchema.properties, convertedId)

    if (targetObject) {
      targetObject.$ref = ref.id
      if (ref.pattern) {
        delete targetObject.pattern
        delete targetObject.enum
      }
    }
  })

  const fakedResponse = {}
  fakedResponse.body = await jsf.resolve(newResponseSchema, jsfRefs)
  for (const key in data.responses) {
    fakedResponse.status = key
    if (key >= 200 && key <= 299) {
      break
    }
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

  const fakedResponse = await jsf.resolve(newRequestSchema, jsfRefs)

  return fakedResponse
}

const generateMockHeaders = async (method, name, data, jsfRefs) => {
  const headers = {}
  data.parameters.forEach(param => {
    if (param.in === 'header') {
      headers[param.name] = (param.schema && param.schema.type) ? { type: param.schema.type } : {}
    }
  })
  jsfRefs.forEach(ref => {
    if (headers[ref.id]) {
      headers[ref.id] = { $ref: ref.id }
    }
  })

  if (Object.keys(headers).length === 0) {
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
