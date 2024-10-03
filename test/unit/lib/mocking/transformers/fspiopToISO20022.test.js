const { TransformFacades } = require('@mojaloop/ml-schema-transformer-lib')
const { requestTransform, callbackTransform } = require('../../../../../src/lib/mocking/transformers/fspiopToISO20022')

jest.mock('@mojaloop/ml-schema-transformer-lib')

describe('fspiopToISO20022 Transformers', () => {
  describe('requestTransform', () => {
    it('should transform GET /parties request headers', async () => {
      const requestOptions = {
        method: 'get',
        path: '/parties/123',
        headers: {
          accept: 'application/json'
        }
      };

      const transformedRequest = await requestTransform(requestOptions);

      expect(transformedRequest.headers.accept).toBe('application/vnd.interoperability.iso20022.parties+json;version=2.0');
    });

    it('should return original requestOptions if path does not match /parties on get', async () => {
      const requestOptions = {
        method: 'get',
        path: '/resource',
        headers: {
          accept: 'application/json'
        }
      };

      const transformedRequest = await requestTransform(requestOptions);

      expect(transformedRequest).toEqual(requestOptions);
    });

    it('should return original requestOptions if path does not match /quotes on post', async () => {
      const requestOptions = {
        method: 'post',
        path: '/resource',
        headers: {
          accept: 'application/json'
        }
      };

      const transformedRequest = await requestTransform(requestOptions);

      expect(transformedRequest).toEqual(requestOptions);
    });


    it('should transform POST /quotes request headers and body', async () => {
      const requestOptions = {
        method: 'post',
        path: '/quotes',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json'
        },
        body: { quoteId: '123' }
      };

      TransformFacades.FSPIOP.quotes.post.mockResolvedValue({ transformed: 'body' });

      const transformedRequest = await requestTransform(requestOptions);

      expect(transformedRequest.headers.accept).toBe('application/vnd.interoperability.iso20022.quotes+json;version=2.0');
      expect(transformedRequest.headers['content-type']).toBe('application/vnd.interoperability.iso20022.quotes+json;version=2.0');
      expect(transformedRequest.body).toEqual({ transformed: 'body' });
    });

    it('should return original requestOptions if no transformation is needed', async () => {
      const requestOptions = {
        method: 'delete',
        path: '/resource',
        headers: {
          accept: 'application/json'
        }
      };

      const transformedRequest = await requestTransform(requestOptions);

      expect(transformedRequest).toEqual(requestOptions);
    });

    it('should handle errors gracefully', async () => {
      const requestOptions = {
        method: 'put',
        path: '/parties/123',
        headers: {
          accept: 'application/json'
        }
      };

      TransformFacades.FSPIOP.parties.put.mockRejectedValue(new Error('Transformation error'));

      const transformedRequest = await requestTransform(requestOptions);

      expect(transformedRequest).toEqual(requestOptions);
    })

  });

  describe('callbackTransform', () => {
    it('should transform PUT /parties callback headers and body', async () => {
      const callbackOptions = {
        method: 'put',
        path: '/parties/123',
        headers: {
          'content-type': 'application/json'
        },
        body: { partyId: '123' }
      };

      TransformFacades.FSPIOPISO20022.parties.put.mockResolvedValue({ transformed: 'body' });

      const transformedCallback = await callbackTransform(callbackOptions);

      expect(transformedCallback.headers['content-type']).toBe('application/vnd.interoperability.parties+json;version=2.0');
      expect(transformedCallback.body).toEqual({ transformed: 'body' });
    });


    it('should return original callbackOptions if no transformation is needed on put if resource does not match parties', async () => {
      const callbackOptions = {
        method: 'put',
        path: '/resource',
        headers: {
          'content-type': 'application/json'
        }
      };

      const transformedCallback = await callbackTransform(callbackOptions);

      expect(transformedCallback).toEqual(callbackOptions);
    });

    it('should handle errors gracefully', async () => {
      const callbackOptions = {
        method: 'put',
        path: '/parties/123',
        headers: {
          'content-type': 'application/json'
        },
        body: { partyId: '123' }
      };

      TransformFacades.FSPIOPISO20022.parties.put.mockRejectedValue(new Error('Transformation error'));

      const transformedCallback = await callbackTransform(callbackOptions);

      expect(transformedCallback).toEqual(callbackOptions);
    });
  });
});
