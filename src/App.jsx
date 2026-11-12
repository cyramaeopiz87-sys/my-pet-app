
import { useEffect, useState } from 'react'
import './App.css'

const API_URL = 'https://dog.ceo/api'

function App() {
  const [dogImage, setDogImage] = useState('')
  const [breeds, setBreeds] = useState([])
  const [selectedBreed, setSelectedBreed] = useState('random')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch a random dog image or an image from a selected breed
  const fetchDog = async (breed = selectedBreed) => {
    try {
      setLoading(true)
      setError('')

      let endpoint = `${API_URL}/breeds/image/random`

      if (breed !== 'random') {
        endpoint = `${API_URL}/breed/${breed}/images/random`
      }

      const response = await fetch(endpoint)

      if (!response.ok) {
        throw new Error('Unable to fetch dog image.')
      }

      const data = await response.json()

      if (data.status !== 'success') {
        throw new Error('Dog image was not found.')
      }

      setDogImage(data.message)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  // Load dog breeds and a random image when the app starts
  useEffect(() => {
    const loadApp = async () => {
      try {
        const response = await fetch(`${API_URL}/breeds/list/all`)

        if (!response.ok) {
          throw new Error('Unable to load dog breeds.')
        }

        const data = await response.json()

        if (data.status !== 'success') {
          throw new Error('Dog breeds could not be loaded.')
        }

        const breedList = []

        Object.entries(data.message).forEach(([breed, subBreeds]) => {
          if (subBreeds.length === 0) {
            breedList.push({
              value: breed,
              label: breed,
            })
          } else {
            subBreeds.forEach((subBreed) => {
              breedList.push({
                value: `${breed}/${subBreed}`,
                label: `${subBreed} ${breed}`,
              })
            })
          }
        })

        setBreeds(breedList)
        await fetchDog('random')
      } catch (err) {
        setError(err.message || 'Unable to connect to Dog API.')
      }
    }

    loadApp()
  }, [])

  // Handle breed selection
  const handleBreedChange = (event) => {
    const breed = event.target.value

    setSelectedBreed(breed)
    fetchDog(breed)
  }

  return (
    <main className="app">
      <header className="navbar">
        <a className="brand" href="/">
          <span className="brand-icon">🐾</span>
          My Pet App
        </a>

        <span className="nav-label">
          Discover your favorite dogs
        </span>
      </header>

      <section className="hero-section">
        <div className="hero-text">
          <span className="eyebrow">
            🐶 YOUR DAILY DOSE OF CUTENESS
          </span>

          <h1>
            Find your new
            <span> furry friend.</span>
          </h1>

          <p>
            Explore different dog breeds and discover adorable
            dogs from around the world.
          </p>
        </div>

        <div className="pet-card">
          <div className="card-header">
            <div>
              <span className="card-label">MEET YOUR PET</span>
              <h2>
                {selectedBreed === 'random'
                  ? 'Random Dog'
                  : selectedBreed.split('/').reverse().join(' ')}
              </h2>
            </div>

            <span className="heart">♥</span>
          </div>

          <div className="image-container">
            {loading ? (
              <div className="image-message">
                Finding a cute dog... 🐾
              </div>
            ) : error ? (
              <div className="image-message error">
                {error}
              </div>
            ) : (
              <img
                className="dog-image"
                src={dogImage}
                alt="Dog from Dog CEO API"
              />
            )}
          </div>

          <div className="breed-section">
            <label htmlFor="breed">Choose a dog breed</label>

            <select
              id="breed"
              value={selectedBreed}
              onChange={handleBreedChange}
            >
              <option value="random">All breeds (Random)</option>

              {breeds.map((breed) => (
                <option key={breed.value} value={breed.value}>
                  {breed.label}
                </option>
              ))}
            </select>

            <button
              className="fetch-button"
              type="button"
              onClick={() => fetchDog()}
              disabled={loading}
            >
              {loading ? 'Finding a dog...' : '🐾 Fetch Another'}
            </button>

            <p className="coming-soon">
              Powered by Dog CEO API
            </p>
          </div>
        </div>
      </section>

      <footer>
        Made with ♥ for dog lovers.
      </footer>
    </main>
  )
}

export default App
