import {Component} from 'react'
import Loader from 'react-loader-spinner'

import ProjectCard from './components/ProjectCard'
import './App.css'

// This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

// Replace your code here
class App extends Component {
  state = {
    category: categoriesList[0].id,
    projects: [],
    apiStatus: apiConstants.initial,
  }

  componentDidMount() {
    this.getProjects()
  }

  getProjects = async () => {
    this.setState({apiStatus: apiConstants.loading})
    const {category} = this.state
    const projectsApiUrl = `https://apis.ccbp.in/ps/projects?category=${category}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(projectsApiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.projects.map(proj => ({
        id: proj.id,
        name: proj.name,
        imageUrl: proj.image_url,
      }))
      this.setState({projects: updatedData, apiStatus: apiConstants.success})
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  onChangeCategory = event => {
    this.setState({category: event.target.value}, this.getProjects)
  }

  successView = () => {
    const {category, projects} = this.state
    return (
      <div className="projects-filter-container">
        <select
          id="category"
          value={category}
          onChange={this.onChangeCategory}
          className="select-style"
        >
          {categoriesList.map(cat => (
            <option key={cat.id} id={cat.id} value={cat.id}>
              {cat.displayText}
            </option>
          ))}
        </select>
        <ul className="project-card-list">
          {projects.map(proj => (
            <ProjectCard key={proj.id} details={proj} />
          ))}
        </ul>
      </div>
    )
  }

  loadingView = () => (
    <div className="loading-failure-views" data-testid="loader">
      <Loader type="ThreeDots" height="50" width="50" color="#328af2" />
    </div>
  )

  failureView = () => (
    <div className="loading-failure-views">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" onClick={this.getProjects} className="retry-btn">
        Retry
      </button>
    </div>
  )

  renderView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.loading:
        return this.loadingView()
      case apiConstants.success:
        return this.successView()
      case apiConstants.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="main-container">
        <div className="header-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </div>
        {this.renderView()}
      </div>
    )
  }
}
export default App
