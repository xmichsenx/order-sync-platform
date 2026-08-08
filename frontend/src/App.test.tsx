import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { App } from './App'

describe('App', () => {
  it('displays the project name', () => {
    expect(renderToStaticMarkup(<App />)).toContain('Order Sync Platform')
  })
})
