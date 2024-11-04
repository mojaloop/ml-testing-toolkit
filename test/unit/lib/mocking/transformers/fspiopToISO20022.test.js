const { TransformFacades } = require('@mojaloop/ml-schema-transformer-lib')
const { forwardTransform, reverseTransform } = require('../../../../../src/lib/mocking/transformers/fspiopToISO20022')

jest.mock('@mojaloop/ml-schema-transformer-lib')

describe('fspiopToISO20022 Transformers', () => {
  describe('forwardTransform', () => {
    it('should transform GET /parties request headers', async () => {
      const requestOptions = {
        method: 'get',
        path: '/parties/MSISDN/123',
        headers: {
          accept: 'application/vnd.interoperability.parties+json;version=2.0',
          'content-type': 'application/vnd.interoperability.parties+json;version=2.0'
        }
      };

      const transformedRequest = await forwardTransform(requestOptions);

      expect(transformedRequest.headers.accept).toBe('application/vnd.interoperability.iso20022.parties+json;version=2.0');
    });

    it('should transform GET /parties request headers with content type header in different case', async () => {
      const requestOptions = {
        method: 'get',
        path: '/parties/MSISDN/123',
        headers: {
          accept: 'application/vnd.interoperability.parties+json;version=2.0',
          'Content-Type': 'application/vnd.interoperability.parties+json;version=2.0'
        }
      };

      const transformedRequest = await forwardTransform(requestOptions);

      expect(transformedRequest.headers.accept).toBe('application/vnd.interoperability.iso20022.parties+json;version=2.0');
    });

    it('should transform GET request headers', async () => {
      const _validateGetTransformation = async (resource) => {
        const requestOptions = {
          method: 'get',
          path: `/${resource}/MSISDN/123`,
          headers: {
            accept: `application/vnd.interoperability.${resource}+json;version=2.0`,
            'content-type': `application/vnd.interoperability.${resource}+json;version=2.0`
          }
        };
        const transformedRequest = await forwardTransform(requestOptions);
        expect(transformedRequest.headers.accept).toBe(`application/vnd.interoperability.iso20022.${resource}+json;version=2.0`);
      }
      await _validateGetTransformation('participants')
      await _validateGetTransformation('quotes')
      await _validateGetTransformation('transfers')
      await _validateGetTransformation('fxQuotes')
      await _validateGetTransformation('fxTransfers')

    });

    it('should transform POST /participants request headers', async () => {
      const requestOptions = {
        method: 'post',
        path: '/participants/MSISDN/123',
        headers: {
          accept: 'application/vnd.interoperability.participants+json;version=2.0',
          'content-type': 'application/vnd.interoperability.participants+json;version=2.0'
        }
      };

      const transformedRequest = await forwardTransform(requestOptions);

      expect(transformedRequest.headers.accept).toBe('application/vnd.interoperability.iso20022.participants+json;version=2.0');
    });

    it('should transform POST /quotes request headers', async () => {
      const requestOptions = {
        method: 'post',
        path: '/quotes',
        headers: {
          accept: 'application/vnd.interoperability.quotes+json;version=2.0',
          'content-type': 'application/vnd.interoperability.quotes+json;version=2.0'
        },
        body: {}
      };

      const transformedRequest = await forwardTransform(requestOptions);

      expect(transformedRequest.headers.accept).toBe('application/vnd.interoperability.iso20022.quotes+json;version=2.0');
    });

    it('should transform POST /fxQuotes request headers', async () => {
      const requestOptions = {
        method: 'post',
        path: '/fxQuotes',
        headers: {
          accept: 'application/vnd.interoperability.fxQuotes+json;version=2.0',
          'content-type': 'application/vnd.interoperability.fxQuotes+json;version=2.0'
        },
        body: {}
      };

      const transformedRequest = await forwardTransform(requestOptions);

      expect(transformedRequest.headers.accept).toBe('application/vnd.interoperability.iso20022.fxQuotes+json;version=2.0');
    });

    it('should transform POST /transfers request headers', async () => {
      const requestOptions = {
        method: 'post',
        path: '/transfers',
        headers: {
          accept: 'application/vnd.interoperability.transfers+json;version=2.0',
          'content-type': 'application/vnd.interoperability.transfers+json;version=2.0'
        },
        body: {}
      };

      const transformedRequest = await forwardTransform(requestOptions);

      expect(transformedRequest.headers.accept).toBe('application/vnd.interoperability.iso20022.transfers+json;version=2.0');
    });

    it('should transform POST /fxTransfers request headers', async () => {
      const requestOptions = {
        method: 'post',
        path: '/fxTransfers',
        headers: {
          accept: 'application/vnd.interoperability.fxTransfers+json;version=2.0',
          'content-type': 'application/vnd.interoperability.fxTransfers+json;version=2.0'
        },
        body: {}
      };

      const transformedRequest = await forwardTransform(requestOptions);

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

      const transformedRequest = await forwardTransform(requestOptions);

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

      const transformedRequest = await forwardTransform(requestOptions);

      expect(transformedRequest).toEqual(requestOptions);
    });

    it('should transform POST /quotes request headers and body', async () => {
      const requestOptions = {
        method: 'post',
        path: '/quotes',
        headers: {
          accept: 'application/vnd.interoperability.quotes+json;version=2.0',
          'content-type': 'application/vnd.interoperability.quotes+json;version=2.0'
        },
        body: { quoteId: '123' }
      };

      TransformFacades.FSPIOP.quotes.post.mockResolvedValue({ body: {transformed: 'body'} });

      const transformedRequest = await forwardTransform(requestOptions);

      expect(transformedRequest.headers.accept).toBe('application/vnd.interoperability.iso20022.quotes+json;version=2.0');
      expect(transformedRequest.headers['content-type']).toBe('application/vnd.interoperability.iso20022.quotes+json;version=2.0');
      expect(transformedRequest.body).toEqual({ transformed: 'body' });
    });

    it('should return original requestOptions if content-type header is not in fspiop format', async () => {
      const requestOptions = {
        method: 'post',
        path: '/quotes',
        headers: {
          accept: 'application/vnd.interoperability.quotes+json;version=2.0',
          'content-type': 'application/json'
        },
        body: { quoteId: '123' }
      };

      TransformFacades.FSPIOP.quotes.post.mockResolvedValue({ body: {transformed: 'body'} });

      const transformedRequest = await forwardTransform(requestOptions);

      expect(transformedRequest).toEqual(requestOptions);

    });

    it('should return original requestOptions if no transformation is needed', async () => {
      const requestOptions = {
        method: 'post',
        path: '/resource',
        headers: {
          accept: 'application/vnd.interoperability.resource+json;version=2.0',
          'content-type': 'application/vnd.interoperability.resource+json;version=2.0'
        }
      };

      const transformedRequest = await forwardTransform(requestOptions);

      expect(transformedRequest).toEqual(requestOptions);
    });

    it('should return original requestOptions if no transformation is needed', async () => {
      const requestOptions = {
        method: 'get',
        path: '/resource',
        headers: {
          accept: 'application/vnd.interoperability.resource+json;version=2.0',
          'content-type': 'application/vnd.interoperability.resource+json;version=2.0'
        }
      };

      const transformedRequest = await forwardTransform(requestOptions);

      expect(transformedRequest).toEqual(requestOptions);
    });

    it('should handle errors gracefully', async () => {
      const requestOptions = {
        method: 'post',
        path: '/quotes',
        headers: {
          accept: 'application/vnd.interoperability.quotes+json;version=2.0',
          'content-type': 'application/vnd.interoperability.quotes+json;version=2.0'
        },
        body: {}
      };

      TransformFacades.FSPIOP.quotes.post.mockRejectedValue(new Error('Transformation error'));

      const transformedRequest = await forwardTransform(requestOptions);

      expect(transformedRequest).toEqual(requestOptions);
    })

    it('should transform PUT /quotes request headers and body', async () => {
      const requestOptions = {
        method: 'put',
        path: '/quotes/123',
        headers: {
          accept: 'application/vnd.interoperability.quotes+json;version=2.0',
          'content-type': 'application/vnd.interoperability.quotes+json;version=2.0'
        },
        body: { quoteId: '123' }
      };

      TransformFacades.FSPIOP.quotes.put.mockResolvedValue({ body: {transformed: 'body'} });

      const transformedRequest = await forwardTransform(requestOptions);

      expect(transformedRequest.headers.accept).toBe('application/vnd.interoperability.iso20022.quotes+json;version=2.0');
      expect(transformedRequest.headers['content-type']).toBe('application/vnd.interoperability.iso20022.quotes+json;version=2.0');
      expect(transformedRequest.body).toEqual({ transformed: 'body' });
    });

    it('should transform PUT /fxQuotes request headers and body', async () => {
      const requestOptions = {
        method: 'put',
        path: '/fxQuotes/123',
        headers: {
          accept: 'application/vnd.interoperability.fxQuotes+json;version=2.0',
          'content-type': 'application/vnd.interoperability.fxQuotes+json;version=2.0'
        },
        body: { conversionRequestId: '123' }
      };

      TransformFacades.FSPIOP.fxQuotes.put.mockResolvedValue({ body: {transformed: 'body'} });

      const transformedRequest = await forwardTransform(requestOptions);

      expect(transformedRequest.headers.accept).toBe('application/vnd.interoperability.iso20022.fxQuotes+json;version=2.0');
      expect(transformedRequest.headers['content-type']).toBe('application/vnd.interoperability.iso20022.fxQuotes+json;version=2.0');
      expect(transformedRequest.body).toEqual({ transformed: 'body' });
    })

    it('should transform PUT /transfer request headers and body', async () => {
      const requestOptions = {
        method: 'put',
        path: '/transfers/123',
        headers: {
          accept: 'application/vnd.interoperability.transfers+json;version=2.0',
          'content-type': 'application/vnd.interoperability.transfers+json;version=2.0'
        },
        body: { transferId: '123' }
      };

      TransformFacades.FSPIOP.transfers.put.mockResolvedValue({ body: {transformed: 'body'} });

      const transformedRequest = await forwardTransform(requestOptions);

      expect(transformedRequest.headers.accept).toBe('application/vnd.interoperability.iso20022.transfers+json;version=2.0');
      expect(transformedRequest.headers['content-type']).toBe('application/vnd.interoperability.iso20022.transfers+json;version=2.0');
      expect(transformedRequest.body).toEqual({ transformed: 'body' });
    })

    it('should transform PUT /fxTransfers request headers and body', async () => {
      const requestOptions = {
        method: 'put',
        path: '/fxTransfers/123',
        headers: {
          accept: 'application/vnd.interoperability.fxTransfers+json;version=2.0',
          'content-type': 'application/vnd.interoperability.fxTransfers+json;version=2.0'
        },
        body: { conversionRequestId: '123' }
      };

      TransformFacades.FSPIOP.fxTransfers.put.mockResolvedValue({ body: {transformed: 'body'} });

      const transformedRequest = await forwardTransform(requestOptions);

      expect(transformedRequest.headers.accept).toBe('application/vnd.interoperability.iso20022.fxTransfers+json;version=2.0');
      expect(transformedRequest.headers['content-type']).toBe('application/vnd.interoperability.iso20022.fxTransfers+json;version=2.0');
      expect(transformedRequest.body).toEqual({ transformed: 'body' });
    })

    it('should transform PUT /quotes/{ID}/error request headers and body', async () => {
      const requestOptions = {
        method: 'put',
        path: '/quotes/123/error',
        headers: {
          accept: 'application/vnd.interoperability.quotes+json;version=2.0',
          'content-type': 'application/vnd.interoperability.quotes+json;version=2.0'
        },
        body: { quoteId: '123' }
      };

      TransformFacades.FSPIOP.quotes.putError.mockResolvedValue({ body: {transformed: 'body'} });

      const transformedRequest = await forwardTransform(requestOptions);

      expect(transformedRequest.headers.accept).toBe('application/vnd.interoperability.iso20022.quotes+json;version=2.0');
      expect(transformedRequest.headers['content-type']).toBe('application/vnd.interoperability.iso20022.quotes+json;version=2.0');
      expect(transformedRequest.body).toEqual({ transformed: 'body' });
    });

  });

  describe('reverseTransform', () => {
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

      const transformedCallback = await reverseTransform(callbackOptions);

      expect(transformedCallback.headers['content-type']).toBe('application/vnd.interoperability.parties+json;version=2.0');
      expect(transformedCallback.body).toEqual({ transformed: 'body' });
    });

    it('should transform POST /quotes headers and body', async () => {
      const callbackOptions = {
        method: 'post',
        path: '/quotes/123',
        headers: {
          'content-type': 'application/vnd.interoperability.iso20022.quotes+json;version=2.0'
        },
        body: { partyId: '123' }
      };

      TransformFacades.FSPIOPISO20022.quotes.post.mockResolvedValue({ body: {transformed: 'body'} });

      const transformedCallback = await reverseTransform(callbackOptions);

      expect(transformedCallback.headers['content-type']).toBe('application/vnd.interoperability.quotes+json;version=2.0');
      expect(transformedCallback.body).toEqual({ transformed: 'body' });
    });

    it('should transform PUT /parties callback headers and body if contenty-type is in different case', async () => {
      const callbackOptions = {
        method: 'put',
        path: '/parties/123',
        headers: {
          'Content-Type': 'application/vnd.interoperability.iso20022.parties+json;version=2.0'
        },
        body: { partyId: '123' }
      };

      TransformFacades.FSPIOPISO20022.parties.put.mockResolvedValue({ body: {transformed: 'body'} });

      const transformedCallback = await reverseTransform(callbackOptions);

      expect(transformedCallback.headers['Content-Type']).toBe('application/vnd.interoperability.parties+json;version=2.0');
      expect(transformedCallback.body).toEqual({ transformed: 'body' });
    });

    it('should transform PUT /participants callback headers', async () => {
      const callbackOptions = {
        method: 'put',
        path: '/participants/123',
        headers: {
          'content-type': 'application/vnd.interoperability.iso20022.participants+json;version=2.0'
        },
        body: { partyId: '123' }
      };

      const transformedCallback = await reverseTransform(callbackOptions);

      expect(transformedCallback.headers['content-type']).toBe('application/vnd.interoperability.participants+json;version=2.0');
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

      const transformedCallback = await reverseTransform(callbackOptions);

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

      const transformedCallback = await reverseTransform(callbackOptions);

      expect(transformedCallback.headers['content-type']).toBe('application/vnd.interoperability.fxQuotes+json;version=2.0');
      expect(transformedCallback.body).toEqual({ transformed: 'body' });
    });

    it('should transform PUT /fxQuotes error callback headers and body', async () => {
      const callbackOptions = {
        method: 'put',
        path: '/fxQuotes/123/error',
        headers: {
          'content-type': 'application/vnd.interoperability.iso20022.fxQuotes+json;version=2.0'
        },
        body: { errorInISO: 'isoError' }
      };

      TransformFacades.FSPIOPISO20022.fxQuotes.putError.mockResolvedValue({ body: {errorInformation: 'fspiopError'} });

      const transformedCallback = await reverseTransform(callbackOptions);

      expect(transformedCallback.headers['content-type']).toBe('application/vnd.interoperability.fxQuotes+json;version=2.0');
      expect(transformedCallback.body).toEqual({ errorInformation: 'fspiopError' });
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

      const transformedCallback = await reverseTransform(callbackOptions);

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

      const transformedCallback = await reverseTransform(callbackOptions);

      expect(transformedCallback.headers['content-type']).toBe('application/vnd.interoperability.transfers+json;version=2.0');
      expect(transformedCallback.body).toEqual({ transformed: 'body' });
    });

    it('should return original body if content-type header is not iso20022', async () => {
      const callbackOptions = {
        method: 'put',
        path: '/transfers/123',
        headers: {
          'content-type': 'application/vnd.interoperability.transfers+json;version=2.0'
        },
        body: { quoteId: '123' }
      };

      TransformFacades.FSPIOPISO20022.transfers.put.mockResolvedValue({ body: {transformed: 'body'} });

      const transformedCallback = await reverseTransform(callbackOptions);

      expect(transformedCallback).toEqual(callbackOptions);
    });


    it('should return original callbackOptions if no transformation is needed on put if resource is unknown', async () => {
      const callbackOptions = {
        method: 'put',
        path: '/resource',
        headers: {
          'content-type': 'application/vnd.interoperability.iso20022.resource+json;version=2.0'
        }
      };

      const transformedCallback = await reverseTransform(callbackOptions);

      expect(transformedCallback).toEqual(callbackOptions);
    });

    it('should handle errors gracefully', async () => {
      const callbackOptions = {
        method: 'put',
        path: '/parties/123',
        headers: {
          'content-type': 'application/vnd.interoperability.iso20022.parties+json;version=2.0'
        },
        body: { partyId: '123' }
      };

      TransformFacades.FSPIOPISO20022.parties.put.mockRejectedValue(new Error('Transformation error'));

      const transformedCallback = await reverseTransform(callbackOptions);

      expect(transformedCallback).toEqual(callbackOptions);
    });
  });
});
