'use strict'

const OpenApiVersionTools = require('../../../../src/lib/mocking/openApiVersionTools')
// let sampleAcceptHeader
let sampleAPIsArray

describe('OpenApiVersionTools', () => {
  describe('parseAcceptHeader', () => {
    it('Result must contain the required properties', async () => {
      const result = OpenApiVersionTools.parseAcceptHeader('application/vnd.interoperability.resource+json;version=2.0')
      expect(result).toHaveProperty('resource')
      expect(result).toHaveProperty('majorVersion')
      expect(result).toHaveProperty('minorVersion')
    })

    it('Full String', async () => {
      const result = OpenApiVersionTools.parseAcceptHeader('application/vnd.interoperability.resource+json;version=2.0')
      expect(result.resource).toBe('resource')
      expect(result.majorVersion).toBe(2)
      expect(result.minorVersion).toBe(0)
    })
    it('With multidigit version numbers', async () => {
      const result = OpenApiVersionTools.parseAcceptHeader('application/vnd.interoperability.resource+json;version=254.2430')
      expect(result.resource).toBe('resource')
      expect(result.majorVersion).toBe(254)
      expect(result.minorVersion).toBe(2430)
    })
    it('Without Minor Version', async () => {
      const result = OpenApiVersionTools.parseAcceptHeader('application/vnd.interoperability.resource+json;version=2')
      expect(result.resource).toBe('resource')
      expect(result.majorVersion).toBe(2)
      expect(result.minorVersion).toBeFalsy()
    })
    it('Without version value', async () => {
      const result = OpenApiVersionTools.parseAcceptHeader('application/vnd.interoperability.resource+json;version=')
      expect(result.resource).toBe('resource')
      expect(result.majorVersion).toBeFalsy()
      expect(result.minorVersion).toBeFalsy()
    })
    it('Without version param', async () => {
      const result = OpenApiVersionTools.parseAcceptHeader('application/vnd.interoperability.resource+json;')
      expect(result.resource).toBe('resource')
      expect(result.majorVersion).toBeFalsy()
      expect(result.minorVersion).toBeFalsy()
    })
    it('Without semicolon at the end', async () => {
      const result = OpenApiVersionTools.parseAcceptHeader('application/vnd.interoperability.resource+json')
      expect(result.resource).toBe('resource')
      expect(result.majorVersion).toBeFalsy()
      expect(result.minorVersion).toBeFalsy()
    })
    it('Without exchange format and version number', async () => {
      const result = OpenApiVersionTools.parseAcceptHeader('application/vnd.interoperability.resource')
      expect(result.resource).toBe('resource')
      expect(result.majorVersion).toBeFalsy()
      expect(result.minorVersion).toBeFalsy()
    })
    it('Without exchange format and with version number', async () => {
      const result = OpenApiVersionTools.parseAcceptHeader('application/vnd.interoperability.resource;version=2.0')
      expect(result.resource).toBe('resource')
      expect(result.majorVersion).toBe(2)
      expect(result.minorVersion).toBe(0)
    })
    it('With wildcard resource type', async () => {
      const result = OpenApiVersionTools.parseAcceptHeader('application/vnd.interoperability.*+json;version=2.0')
      expect(result.resource).toBe('*')
      expect(result.majorVersion).toBe(2)
      expect(result.minorVersion).toBe(0)
    })
    it('With wildcard resource type and without exchange format', async () => {
      const result = OpenApiVersionTools.parseAcceptHeader('application/vnd.interoperability.*;version=2.0')
      expect(result.resource).toBe('*')
      expect(result.majorVersion).toBe(2)
      expect(result.minorVersion).toBe(0)
    })
    it('With wildcard resource type and without any trailing string after that', async () => {
      const result = OpenApiVersionTools.parseAcceptHeader('application/vnd.interoperability.*')
      expect(result.resource).toBe('*')
      expect(result.majorVersion).toBeFalsy()
      expect(result.minorVersion).toBeFalsy()
    })
  })

  describe('validateAcceptHeader', () => {
    it('Result must contain the required properties', async () => {
      const result = OpenApiVersionTools.validateAcceptHeader('')
      expect(result).toHaveProperty('validationFailed')
      expect(result).toHaveProperty('message')
    })

    describe('Success cases', () => {
      it('Full String', async () => {
        const result = OpenApiVersionTools.validateAcceptHeader('application/vnd.interoperability.resource+json;version=2.0')
        expect(result.validationFailed).toBe(false)
      })
      it('Without Minor Version', async () => {
        const result = OpenApiVersionTools.validateAcceptHeader('application/vnd.interoperability.resource+json;version=2')
        expect(result.validationFailed).toBe(false)
      })
      it('Without version value', async () => {
        const result = OpenApiVersionTools.validateAcceptHeader('application/vnd.interoperability.resource+json;version=')
        expect(result.validationFailed).toBe(false)
      })
      it('Without version param', async () => {
        const result = OpenApiVersionTools.validateAcceptHeader('application/vnd.interoperability.resource+json;')
        expect(result.validationFailed).toBe(false)
      })
      it('Without semicolon at the end', async () => {
        const result = OpenApiVersionTools.validateAcceptHeader('application/vnd.interoperability.resource+json')
        expect(result.validationFailed).toBe(false)
      })
      it('Without exchange format and version number', async () => {
        const result = OpenApiVersionTools.validateAcceptHeader('application/vnd.interoperability.resource')
        expect(result.validationFailed).toBe(false)
      })
      it('Without exchange format and with version number', async () => {
        const result = OpenApiVersionTools.validateAcceptHeader('application/vnd.interoperability.resource;version=2.0')
        expect(result.validationFailed).toBe(false)
      })
      it('With wildcard resource type', async () => {
        const result = OpenApiVersionTools.validateAcceptHeader('application/vnd.interoperability.*+json;version=2.0')
        expect(result.validationFailed).toBe(false)
      })
      it('With wildcard resource type and without exchange format', async () => {
        const result = OpenApiVersionTools.validateAcceptHeader('application/vnd.interoperability.*;version=2.0')
        expect(result.validationFailed).toBe(false)
      })
      it('With wildcard resource type and without any trailing string after that', async () => {
        const result = OpenApiVersionTools.validateAcceptHeader('application/vnd.interoperability.*')
        expect(result.validationFailed).toBe(false)
      })
    })

    describe('Failure cases', () => {
      it('With version value as text', async () => {
        const result = OpenApiVersionTools.validateAcceptHeader('application/vnd.interoperability.resource+json;version=hello')
        expect(result.validationFailed).toBe(true)
      })
      it('With different exchange format other than json', async () => {
        const result = OpenApiVersionTools.validateAcceptHeader('application/vnd.interoperability.resource+asdf;version=2.0')
        expect(result.validationFailed).toBe(true)
      })
      it('Without application as prefix', async () => {
        const result = OpenApiVersionTools.validateAcceptHeader('asdf/vnd.interoperability.resource+json;version=2.0')
        expect(result.validationFailed).toBe(true)
      })
      it('Without prefix', async () => {
        const result = OpenApiVersionTools.validateAcceptHeader('vnd.interoperability.resource+json;version=2.0')
        expect(result.validationFailed).toBe(true)
      })
      it('With improper application type 1', async () => {
        const result = OpenApiVersionTools.validateAcceptHeader('application/asdfasdf.resource+json;version=2.0')
        expect(result.validationFailed).toBe(true)
      })
      it('With improper application type 2', async () => {
        const result = OpenApiVersionTools.validateAcceptHeader('application/asdf.asdfasdf.resource+json;version=2.0')
        expect(result.validationFailed).toBe(true)
      })
      it('With empty accept header', async () => {
        const result = OpenApiVersionTools.validateAcceptHeader('')
        expect(result.validationFailed).toBe(true)
      })
      it('With some plain text accept header', async () => {
        const result = OpenApiVersionTools.validateAcceptHeader('asdf')
        expect(result.validationFailed).toBe(true)
      })

      it('Some random text 1', async () => {
        const result = OpenApiVersionTools.validateAcceptHeader('asdf/asdf.asdf/asdf')
        expect(result.validationFailed).toBe(true)
      })
      it('Some random text 2', async () => {
        const result = OpenApiVersionTools.validateAcceptHeader('/asdf/')
        expect(result.validationFailed).toBe(true)
      })
      it('Some random text 3', async () => {
        const result = OpenApiVersionTools.validateAcceptHeader('////asdf//')
        expect(result.validationFailed).toBe(true)
      })
      it('Some random text 4', async () => {
        const result = OpenApiVersionTools.validateAcceptHeader('asdf+asdf+asdf')
        expect(result.validationFailed).toBe(true)
      })
    })
  })

  describe('negotiateVersion', () => {
    beforeAll(() => {
      // sampleAcceptHeader = 'application/vnd.interoperability.resource+json;version=2.0'
      sampleAPIsArray = [
        {
          majorVersion: 1,
          minorVersion: 0
        },
        {
          majorVersion: 1,
          minorVersion: 1
        },
        {
          majorVersion: 2,
          minorVersion: 0
        },
        {
          majorVersion: 2,
          minorVersion: 2
        },
        {
          majorVersion: 3,
          minorVersion: 4
        },
        {
          majorVersion: 5,
          minorVersion: 41
        },
        {
          majorVersion: 32,
          minorVersion: 4
        },
        {
          majorVersion: 32,
          minorVersion: 5
        },
        {
          majorVersion: 35,
          minorVersion: 43
        },
        {
          majorVersion: 35,
          minorVersion: 102
        }
      ]
    })

    it('Result must contain the required properties', async () => {
      const result = OpenApiVersionTools.negotiateVersion('')
      expect(result).toHaveProperty('negotiationFailed')
      expect(result).toHaveProperty('message')
      expect(result).toHaveProperty('negotiatedIndex')
    })

    describe('Success cases', () => {
      it('Accept version 1.0', async () => {
        const result = OpenApiVersionTools.negotiateVersion('application/vnd.interoperability.resource+json;version=1.0', sampleAPIsArray)
        expect(result.negotiationFailed).toBe(false)
        expect(result.negotiatedIndex).toBe(0)
      })
      it('Accept version 1.1', async () => {
        const result = OpenApiVersionTools.negotiateVersion('application/vnd.interoperability.resource+json;version=1.1', sampleAPIsArray)
        expect(result.negotiationFailed).toBe(false)
        expect(result.negotiatedIndex).toBe(1)
      })
      it('Accept version 2.2', async () => {
        const result = OpenApiVersionTools.negotiateVersion('application/vnd.interoperability.resource+json;version=2.2', sampleAPIsArray)
        expect(result.negotiationFailed).toBe(false)
        expect(result.negotiatedIndex).toBe(3)
      })
      it('Accept version 3.4', async () => {
        const result = OpenApiVersionTools.negotiateVersion('application/vnd.interoperability.resource+json;version=3.4', sampleAPIsArray)
        expect(result.negotiationFailed).toBe(false)
        expect(result.negotiatedIndex).toBe(4)
      })
      it('Accept version 1', async () => {
        const result = OpenApiVersionTools.negotiateVersion('application/vnd.interoperability.resource+json;version=1', sampleAPIsArray)
        expect(result.negotiationFailed).toBe(false)
        expect(result.negotiatedIndex).toBe(1)
      })
      it('Accept version 2', async () => {
        const result = OpenApiVersionTools.negotiateVersion('application/vnd.interoperability.resource+json;version=2', sampleAPIsArray)
        expect(result.negotiationFailed).toBe(false)
        expect(result.negotiatedIndex).toBe(3)
      })
      it('Accept version 3', async () => {
        const result = OpenApiVersionTools.negotiateVersion('application/vnd.interoperability.resource+json;version=3', sampleAPIsArray)
        expect(result.negotiationFailed).toBe(false)
        expect(result.negotiatedIndex).toBe(4)
      })
      it('Accept version 5.41', async () => {
        const result = OpenApiVersionTools.negotiateVersion('application/vnd.interoperability.resource+json;version=5.41', sampleAPIsArray)
        expect(result.negotiationFailed).toBe(false)
        expect(result.negotiatedIndex).toBe(5)
      })
      it('Accept version 32.4', async () => {
        const result = OpenApiVersionTools.negotiateVersion('application/vnd.interoperability.resource+json;version=32.4', sampleAPIsArray)
        expect(result.negotiationFailed).toBe(false)
        expect(result.negotiatedIndex).toBe(6)
      })
      it('Accept version 35.102', async () => {
        const result = OpenApiVersionTools.negotiateVersion('application/vnd.interoperability.resource+json;version=35.102', sampleAPIsArray)
        expect(result.negotiationFailed).toBe(false)
        expect(result.negotiatedIndex).toBe(9)
      })
      it('Accept version 32', async () => {
        const result = OpenApiVersionTools.negotiateVersion('application/vnd.interoperability.resource+json;version=32', sampleAPIsArray)
        expect(result.negotiationFailed).toBe(false)
        expect(result.negotiatedIndex).toBe(7)
      })
      it('Accept version 35', async () => {
        const result = OpenApiVersionTools.negotiateVersion('application/vnd.interoperability.resource+json;version=35', sampleAPIsArray)
        expect(result.negotiationFailed).toBe(false)
        expect(result.negotiatedIndex).toBe(9)
      })
      it('Accept Everything', async () => {
        const result = OpenApiVersionTools.negotiateVersion('application/vnd.interoperability.resource+json;', sampleAPIsArray)
        expect(result.negotiationFailed).toBe(false)
        expect(result.negotiatedIndex).toBe(9)
      })
    })

    describe('Failure cases', () => {
      it('Accept version 1.2', async () => {
        const result = OpenApiVersionTools.negotiateVersion('application/vnd.interoperability.resource+json;version=1.2', sampleAPIsArray)
        expect(result.negotiationFailed).toBe(true)
        expect(result.negotiatedIndex).toBeNull()
      })
      it('Accept version 3.0', async () => {
        const result = OpenApiVersionTools.negotiateVersion('application/vnd.interoperability.resource+json;version=3.0', sampleAPIsArray)
        expect(result.negotiationFailed).toBe(true)
        expect(result.negotiatedIndex).toBeNull()
      })
      it('Accept version 5.2', async () => {
        const result = OpenApiVersionTools.negotiateVersion('application/vnd.interoperability.resource+json;version=5.2', sampleAPIsArray)
        expect(result.negotiationFailed).toBe(true)
        expect(result.negotiatedIndex).toBeNull()
      })
      it('Accept version 6', async () => {
        const result = OpenApiVersionTools.negotiateVersion('application/vnd.interoperability.resource+json;version=6', sampleAPIsArray)
        expect(result.negotiationFailed).toBe(true)
        expect(result.negotiatedIndex).toBeNull()
      })
      it('Accept version 5.2', async () => {
        const result = OpenApiVersionTools.negotiateVersion('application/vnd.interoperability.resource+json;version=5.2', sampleAPIsArray)
        expect(result.negotiationFailed).toBe(true)
        expect(result.negotiatedIndex).toBeNull()
      })
      it('Accept version 32.8', async () => {
        const result = OpenApiVersionTools.negotiateVersion('application/vnd.interoperability.resource+json;version=32.8', sampleAPIsArray)
        expect(result.negotiationFailed).toBe(true)
        expect(result.negotiatedIndex).toBeNull()
      })
      it('Accept version 32.86', async () => {
        const result = OpenApiVersionTools.negotiateVersion('application/vnd.interoperability.resource+json;version=32.86', sampleAPIsArray)
        expect(result.negotiationFailed).toBe(true)
        expect(result.negotiatedIndex).toBeNull()
      })
      it('Accept version 38.8', async () => {
        const result = OpenApiVersionTools.negotiateVersion('application/vnd.interoperability.resource+json;version=38.8', sampleAPIsArray)
        expect(result.negotiationFailed).toBe(true)
        expect(result.negotiatedIndex).toBeNull()
      })
      it('Accept version 35.106', async () => {
        const result = OpenApiVersionTools.negotiateVersion('application/vnd.interoperability.resource+json;version=35.106', sampleAPIsArray)
        expect(result.negotiationFailed).toBe(true)
        expect(result.negotiatedIndex).toBeNull()
      })
      it('Accept version 107', async () => {
        const result = OpenApiVersionTools.negotiateVersion('application/vnd.interoperability.resource+json;version=107', sampleAPIsArray)
        expect(result.negotiationFailed).toBe(true)
        expect(result.negotiatedIndex).toBeNull()
      })
      it('Accept version 107.108', async () => {
        const result = OpenApiVersionTools.negotiateVersion('application/vnd.interoperability.resource+json;version=107.108', sampleAPIsArray)
        expect(result.negotiationFailed).toBe(true)
        expect(result.negotiatedIndex).toBeNull()
      })
    })
  })
})
