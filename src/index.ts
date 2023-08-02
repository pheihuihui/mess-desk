import { createRoot } from 'react-dom/client'
import { _app } from './pages/_app'

let div = document.getElementById('rootdiv') as HTMLDivElement

const root = createRoot(div)
root.render(_app)
