const _ = require('lodash')
const fs = require('fs')
const jref = require('json-ref-lite')
const yaml = require('js-yaml')
const faker = require('faker')
const jsf = require('json-schema-faker')

jsf.format('byte', () => Buffer.alloc(faker.lorem.sentence(12)).toString('base64'))

jsf.option({
  alwaysFakeOptionals: true,
  ignoreMissingRefs: true
})
jsf.extend('faker', () => require('faker'))

const ajv = require('ajv')({
  unknownFormats: 'ignore'
})

function loadYamlFile (fn) {
  let tree = yaml.safeLoad(fs.readFileSync(fn, 'utf8'))

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
  tree = jref.resolve(tree)

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
  const { content } = _.find(r, (v, k) => k >= 200 && k <= 299)
  if (content == null) {
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

const generateMockOperation = async (method, name, data, jsfRefs) => {
  const requestSchema = findRequestSchema(data.requestBody)

  jsfRefs.forEach(ref => {
    const targetObject = _.get(requestSchema.properties, ref.id)
    if (targetObject) {
      targetObject.$ref = ref.id
    }
  })

  if (requestSchema == null) {
    return {}
  }

  const fakedResponse = await jsf.resolve(requestSchema, jsfRefs)

  return fakedResponse
}

class OpenApiRequestGenerator {
  constructor (schemaPath) {
    if (typeof schemaPath === 'string' || schemaPath instanceof String) {
      this.schema = loadYamlFile(schemaPath)
    } else {
      this.schema = schemaPath
    }
  }

  generateRequestBody (path, httpMethod, jsfRefs) {
    const pathValue = this.schema.paths[path]
    const operation = pathValue[httpMethod]
    const id = operation.operationId || operation.summary
    return generateMockOperation(httpMethod, id, operation, jsfRefs)
  }
}

module.exports = OpenApiRequestGenerator
