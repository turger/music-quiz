import { render, screen } from '@testing-library/react'
import App from './App'

test('renders learn react link', () => {
  render(<App songCount={10} />)
  const linkElement = screen.getByText(/music quiz/i)
  expect(linkElement).toBeInTheDocument()
})
