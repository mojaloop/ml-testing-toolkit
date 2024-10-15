const { TransformFacades } = require('@mojaloop/ml-schema-transformer-lib')
const { requestTransform, callbackTransform } = require('../../../../../src/lib/mocking/transformers/fspiopToISO20022')

jest.mock('@mojaloop/ml-schema-transformer-lib')

describe('fspiopToISO20022 Transformers', () => {
  describe('requestTransform', () => {
    it('should transform GET /parties request headers', async () => {
      const requestOptions = {
        method: 'get',
        path: '/parties/MSISDN/123',
        headers: {
          accept: 'application/vnd.interoperability.parties+json;version=2.0'
        }
      };

      const transformedRequest = await requestTransform(requestOptions);

      expect(transformedRequest.headers.accept).toBe('application/vnd.interoperability.iso20022.parties+json;version=2.0');
    });

    it('should transform POST /quotes request headers', async () => {
      const requestOptions = {
        method: 'post',
        path: '/quotes',
        headers: {
          accept: 'application/vnd.interoperability.quotes+json;version=2.0'
        },
        body: {}
      };

      const transformedRequest = await requestTransform(requestOptions);

      expect(transformedRequest.headers.accept).toBe('application/vnd.interoperability.iso20022.quotes+json;version=2.0');
    });

    it('should transform POST /fxQuotes request headers', async () => {
      const requestOptions = {
        method: 'post',
        path: '/fxQuotes',
        headers: {
          accept: 'application/vnd.interoperability.fxQuotes+json;version=2.0'
        },
        body: {}
      };

      const transformedRequest = await requestTransform(requestOptions);

      expect(transformedRequest.headers.accept).toBe('application/vnd.interoperability.iso20022.fxQuotes+json;version=2.0');
    });

    it('should transform POST /transfers request headers', async () => {
      const requestOptions = {
        method: 'post',
        path: '/transfers',
        headers: {
          accept: 'application/vnd.interoperability.transfers+json;version=2.0'
        },
        body: {}
      };

      const transformedRequest = await requestTransform(requestOptions);

      expect(transformedRequest.headers.accept).toBe('application/vnd.interoperability.iso20022.transfers+json;version=2.0');
    });

    it('should transform POST /fxTransfers request headers', async () => {
      const requestOptions = {
        method: 'post',
        path: '/fxTransfers',
        headers: {
          accept: 'application/vnd.interoperability.fxTransfers+json;version=2.0'
        },
        body: {}
      };

      const transformedRequest = await requestTransform(requestOptions);

      expect(transformedRequest.headers.accept).toBe('application/vnd.interoperability.iso20022.fxTransfers+json;version=2.0');
    });

    it('should return original requestOptions if path contains unknown resource', async () => {
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

    it('should return original requestOptions if path contains unknown resource', async () => {
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

      TransformFacades.FSPIOP.quotes.post.mockResolvedValue({ body: {transformed: 'body'} });

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
        method: 'post',
        path: '/quotes',
        headers: {
          accept: 'application/json'
        },
        body: {}
      };

      TransformFacades.FSPIOP.quotes.post.mockRejectedValue(new Error('Transformation error'));

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
          'content-type': 'application/vnd.interoperability.iso20022.parties+json;version=2.0'
        },
        body: { partyId: '123' }
      };

      TransformFacades.FSPIOPISO20022.parties.put.mockResolvedValue({ body: {transformed: 'body'} });

      const transformedCallback = await callbackTransform(callbackOptions);

      expect(transformedCallback.headers['content-type']).toBe('application/vnd.interoperability.parties+json;version=2.0');
      expect(transformedCallback.body).toEqual({ transformed: 'body' });
    });

    it('should transform PUT /quotes callback headers and body', async () => {
      const callbackOptions = {
        method: 'put',
        path: '/quotes/123',
        headers: {
          'content-type': 'application/vnd.interoperability.iso20022.quotes+json;version=2.0'
        },
        body: { quoteId: '123' }
      };

      TransformFacades.FSPIOPISO20022.quotes.put.mockResolvedValue({ body: {transformed: 'body'} });

      const transformedCallback = await callbackTransform(callbackOptions);

      expect(transformedCallback.headers['content-type']).toBe('application/vnd.interoperability.quotes+json;version=2.0');
      expect(transformedCallback.body).toEqual({ transformed: 'body' });
    });

    it('should transform PUT /fxQuotes callback headers and body', async () => {
      const callbackOptions = {
        method: 'put',
        path: '/fxQuotes/123',
        headers: {
          'content-type': 'application/vnd.interoperability.iso20022.fxQuotes+json;version=2.0'
        },
        body: { quoteId: '123' }
      };

      TransformFacades.FSPIOPISO20022.fxQuotes.put.mockResolvedValue({ body: {transformed: 'body'} });

      const transformedCallback = await callbackTransform(callbackOptions);

      expect(transformedCallback.headers['content-type']).toBe('application/vnd.interoperability.fxQuotes+json;version=2.0');
      expect(transformedCallback.body).toEqual({ transformed: 'body' });
    });

    it('should transform PUT /fxTransfers callback headers and body', async () => {
      const callbackOptions = {
        method: 'put',
        path: '/fxTransfers/123',
        headers: {
          'content-type': 'application/vnd.interoperability.iso20022.fxTransfers+json;version=2.0'
        },
        body: { quoteId: '123' }
      };

      TransformFacades.FSPIOPISO20022.fxTransfers.put.mockResolvedValue({ body: {transformed: 'body'} });

      const transformedCallback = await callbackTransform(callbackOptions);

      expect(transformedCallback.headers['content-type']).toBe('application/vnd.interoperability.fxTransfers+json;version=2.0');
      expect(transformedCallback.body).toEqual({ transformed: 'body' });
    });

    it('should transform PUT /transfers callback headers and body', async () => {
      const callbackOptions = {
        method: 'put',
        path: '/transfers/123',
        headers: {
          'content-type': 'application/vnd.interoperability.iso20022.transfers+json;version=2.0'
        },
        body: { quoteId: '123' }
      };

      TransformFacades.FSPIOPISO20022.transfers.put.mockResolvedValue({ body: {transformed: 'body'} });

      const transformedCallback = await callbackTransform(callbackOptions);

      expect(transformedCallback.headers['content-type']).toBe('application/vnd.interoperability.transfers+json;version=2.0');
      expect(transformedCallback.body).toEqual({ transformed: 'body' });
    });


    it('should return original callbackOptions if no transformation is needed on put if resource is unknown', async () => {
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
