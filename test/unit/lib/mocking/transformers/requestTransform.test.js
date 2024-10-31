const { requestTransform } = require('../../../../../src/lib/mocking/transformers/fspiopToISO20022')

describe('requestTransform Tests with real transformLib -->', () => {
  it('should transform real PUT /quotes request', async () => {
    const requestOptions = {
      method: 'put',
      path: '/quotes/01JBHNDR4S6TWQ0YVKZWCXMEDX',
      headers: {
        'Content-Type': 'application/vnd.interoperability.quotes+json;version=2.0',
        Date: 'Thu, 31 Oct 2024 16:09:34 GMT',
        'FSPIOP-Source': 'noresponsepayeefsp',
        'FSPIOP-Destination': 'testingtoolkitdfsp',
        traceparent: '00-aabbf2d633e333ccb93af62ec4c02d00-0123456789abcdef0-00'
      },
      body: {
        transferAmount: {
          currency: 'XXX',
          amount: '1'
        },
        payeeReceiveAmount: {
          currency: 'XXX',
          amount: '1'
        },
        payeeFspFee: {
          currency: 'XXX',
          amount: '0'
        },
        payeeFspCommission: {
          currency: 'XXX',
          amount: '0'
        },
        expiration: '2024-11-01T16:09:34.713Z',
        ilpPacket: 'DIICYwAAAAAAAABkMjAyNDEwMjkxMTE0MTQzNTIv1lSZPk0mP5Io_nXbsO9zUmQXinvjJbhGwsqc53pARgpnLm1vamFsb29wggIcZXlKMGNtRnVjMkZqZEdsdmJrbGtJam9pTURGS1FqbEVRVk5PTURGRVdUUlhTME5hV1RoWVVrVTBXa01pTENKeGRXOTBaVWxrSWpvaU1ERktRamxFUVZOWk5EZFNUVVEwUzFOS1MwZElVMW8wTUVvaUxDSndZWGxsWlNJNmV5SndZWEowZVVsa1NXNW1ieUk2ZXlKd1lYSjBlVWxrVkhsd1pTSTZJalUwTXpJeE1EQXhJaXdpY0dGeWRIbEpaR1Z1ZEdsbWFXVnlJam9pVFZOSlUwUk9JaXdpWm5Od1NXUWlPaUowZEd0d1lYbGxaV1p6Y0NKOWZTd2ljR0Y1WlhJaU9uc2ljR0Z5ZEhsSlpFbHVabThpT25zaWNHRnlkSGxKWkZSNWNHVWlPaUkwTkRFeU16UTFOamM0T1NJc0luQmhjblI1U1dSbGJuUnBabWxsY2lJNklrMVRTVk5FVGlJc0ltWnpjRWxrSWpvaWRIUnJabmh3WVhsbGNpSjlmU3dpWVcxdmRXNTBJanA3SW1OMWNuSmxibU41SWpvaVdGUlRJaXdpWVcxdmRXNTBJam9pTVRBd0luMHNJblJ5WVc1ellXTjBhVzl1Vkhsd1pTSTZiblZzYkN3aVpYaHdhWEpoZEdsdmJpSTZJakl3TWpRdE1UQXRNamxVTVRFNk1UUTZNVFF1TXpVeVdpSXNJbTV2ZEdVaU9tNTFiR3g5',
        condition: 'L9ZUmT5NJj-SKP5127Dvc1JkF4p74yW4RsLKnOd6QEY'
      }
    };

    const transformedRequest = await requestTransform(requestOptions);

    expect(transformedRequest.headers['Content-Type']).toBe('application/vnd.interoperability.iso20022.quotes+json;version=2.0');
    expect(transformedRequest.body.GrpHdr).toBeTruthy();
    expect(transformedRequest.body.CdtTrfTxInf).toBeTruthy();
  });
})
