module.exports = jest.fn().mockImplementation(async (input, rules, options) => {
  // Mock lint behavior - check if scope is uppercase
  const hasUppercaseScope = /\([A-Z]/.test(input);
  
  if (hasUppercaseScope) {
    return {
      valid: false,
      errors: [
        {
          level: 2,
          name: 'scope-case',
          message: 'scope must be lower-case'
        }
      ],
      warnings: []
    };
  }
  
  return {
    valid: true,
    errors: [],
    warnings: []
  };
});