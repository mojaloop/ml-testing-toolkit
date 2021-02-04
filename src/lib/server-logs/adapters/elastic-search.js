
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
 * Steven Oderayi <steven.oderayi@modusbox.com> (Original Author)
 --------------
 ******/
const { Client } = require('@elastic/elasticsearch')
const config = { url: null, index: null, pageSize: 20 }
let client

const init = ({ url, index, pageSize }) => {
  if (!url) throw new Error('[ElasticSearch Adapter] URL is required.')
  config.url = url
  config.index = index
  config.pageSize = pageSize
  client = !client ? new Client({ node: url }) : client
}

const search = async ({ query }) => _marshalResponse(await client.search(_toQueryObject(query)))

const setClient = (_client) => {
  client = _client
}

const _marshalResponse = (clientResponse) => {
  if (clientResponse.statusCode === 200) {
    if (clientResponse.body.hits.total.value > 0) {
      const hits = clientResponse.body.hits.hits.map(hit => ({
        metadata: {
          service: hit._source.metadata.trace.service,
          timestamp: hit._source.metadata.trace.startTimestamp,
          source: hit._source.metadata.trace.tags.source,
          destination: hit._source.metadata.trace.tags.destination,
          status: hit._source.metadata.event.state.status
        },
        content: hit._source.content
      }))
      return hits
    }
  }
}

const _toQueryObject = (query) => {
  const queryObject = {
    index: config.index,
    size: config.pageSize,
    body: {
      query: {
        bool: {
          must: []
        }
      }
    }
  }
  const predicates = []
  Object.entries(query).map((kv, i) => {
    const predicate = {}
    predicate[kv[0]] = kv[1]
    predicates[i] = { match: predicate }
  })
  queryObject.body.query.bool.must = [
    ...queryObject.body.query.bool.must,
    ...predicates
  ]

  return queryObject
}

module.exports = {
  init,
  search,
  setClient // exported for test only
}
