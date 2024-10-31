import { render, screen } from '@testing-library/react'
import App from './App'

test('renders turtle soccer', () => {
    render(<App />)
    const linkElement = screen.getAllByText(/Turtle Soccer/i)
    expect(linkElement[0]).toBeInTheDocument()
})
