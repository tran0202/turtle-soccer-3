import { createRoot } from 'react-dom/client'
import Routing from './core/Routing'

const container = document.getElementById('root')
const root = createRoot(container) // createRoot(container!) if you use TypeScript
root.render(<Routing />)
