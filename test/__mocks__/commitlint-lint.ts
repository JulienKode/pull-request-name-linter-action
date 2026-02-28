import {vi} from 'vitest'

export default vi.fn().mockImplementation(async (input: string) => {
  const hasUppercaseScope = /\([A-Z]/.test(input)

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
    }
  }

  return {
    valid: true,
    errors: [],
    warnings: []
  }
})
