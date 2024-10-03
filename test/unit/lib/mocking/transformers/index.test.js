const { getTransformer } = require('../../../../../src/lib/mocking/transformers');

describe('getTransformer', () => {
  it('should return null for "none"', () => {
    expect(getTransformer('none')).toBeNull();
  });

  it('should return null for "NONE"', () => {
    expect(getTransformer('NONE')).toBeNull();
  });

  it('should return null for "no"', () => {
    expect(getTransformer('no')).toBeNull();
  });

  it('should return null for "NO"', () => {
    expect(getTransformer('NO')).toBeNull();
  });

  it('should return the transformer module for a valid transformer name', () => {
    const transformerName = 'fspiopToISO20022';
    jest.mock(`../../../../../src/lib/mocking/transformers/fspiopToISO20022`, () => ({}), { virtual: true });
    const transformerModule = getTransformer(transformerName);
    expect(transformerModule).toBeDefined();
  });

  it('should throw an error for an invalid transformer name', () => {
    const transformerName = 'invalidTransformer';
    expect(() => getTransformer(transformerName)).toThrow();
  });
});
