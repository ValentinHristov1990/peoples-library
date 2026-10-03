import './App.css'
import Footer from './Footer'
import Hero from './Hero'
import Nav from './Navigation'

function App() {

  return (
    <div className='app-layout'>
      <Nav />
      <main>
        <Hero />
      </main>
      <Footer />
    </div>
  )
}

export default App
