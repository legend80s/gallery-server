import { afterEach, expect } from 'bun:test'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// @ts-expect-error
expect.extend(matchers)

// Optional: cleans up `render` after each test
afterEach(() => {
  cleanup()
})
