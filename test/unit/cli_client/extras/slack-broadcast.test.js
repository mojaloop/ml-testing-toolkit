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
 * Vijay Kumar Guthi <vijaya.guthi@modusbox.com> (Original Author)
 --------------
 ******/
'use strict'

const { IncomingWebhook } = require('@slack/webhook')
jest.mock('@slack/webhook')
const webhook = {
  send: async () => {}
}
IncomingWebhook.mockImplementationOnce(() => {
  return webhook
})

const objectStore = require('../../../../src/cli_client/objectStore')
jest.mock('../../../../src/cli_client/objectStore')
const config = {
  slackPassedImage: 'asdf',
  slackFailedImage: 'asdf'
}
objectStore.get.mockReturnValue(config)

const slackBroadCast = require('../../../../src/cli_client/extras/slack-broadcast')

const sampleProgress = {
  test_cases: [],
  runtimeInformation: {}
}
const sampleReportURL = 'asdf'

describe('Cli client', () => {
  describe('sendSlackNotification', () => {
    it('When slackWebhookUrl config is null, it should do nothing', async () => {
      config.slackWebhookUrl = null
      const SpySlackSend = jest.spyOn(webhook, 'send')
      SpySlackSend.mockImplementationOnce(async () => null)
      await expect(slackBroadCast.sendSlackNotification(sampleProgress)).resolves.toBe(undefined)
    })
    it('When slackWebhookUrl config is set, it should call slack send function', async () => {
      config.slackWebhookUrl = 'http://some_url'
      const SpySlackSend = jest.spyOn(webhook, 'send')
      SpySlackSend.mockImplementationOnce(async () => null)
      await expect(slackBroadCast.sendSlackNotification(sampleProgress)).resolves.toBe(undefined)
      expect(SpySlackSend).toHaveBeenCalledWith(expect.objectContaining({
        text: expect.any(String),
        blocks: expect.any(Array)
      }))
    })
    it('When reportURL is set, it should call slack send function', async () => {
      config.slackWebhookUrl = 'http://some_url'
      const SpySlackSend = jest.spyOn(webhook, 'send')
      SpySlackSend.mockImplementationOnce(async () => null)
      await expect(slackBroadCast.sendSlackNotification(sampleProgress, sampleReportURL)).resolves.toBe(undefined)
      expect(SpySlackSend).toHaveBeenCalledWith(expect.objectContaining({
        text: expect.any(String),
        blocks: expect.any(Array)
      }))
    })
    it('When the progress contains testCases, it should call slack send function', async () => {
      config.slackWebhookUrl = 'http://some_url'
      sampleProgress.test_cases = [
        {
          requests: [
            {
              request: {
                tests: {
                  assertions: [],
                  passedAssertionsCount: 0
                }
              }
            }
          ]
        }
      ]
      const SpySlackSend = jest.spyOn(webhook, 'send')
      SpySlackSend.mockImplementationOnce(async () => null)
      await expect(slackBroadCast.sendSlackNotification(sampleProgress)).resolves.toBe(undefined)
      expect(SpySlackSend).toHaveBeenCalledWith(expect.objectContaining({
        text: expect.any(String),
        blocks: expect.any(Array)
      }))
    })
    it('When failed case, it should call slack send function', async () => {
      config.slackWebhookUrl = 'http://some_url'
      sampleProgress.test_cases = [
        {
          requests: [
            {
              request: {
                tests: {
                  assertions: [{}],
                  passedAssertionsCount: 0
                }
              }
            }
          ]
        }
      ]
      const SpySlackSend = jest.spyOn(webhook, 'send')
      SpySlackSend.mockImplementationOnce(async () => null)
      await expect(slackBroadCast.sendSlackNotification(sampleProgress)).resolves.toBe(undefined)
      expect(SpySlackSend).toHaveBeenCalledWith(expect.objectContaining({
        text: expect.any(String),
        blocks: expect.any(Array)
      }))
    })
  })
})
