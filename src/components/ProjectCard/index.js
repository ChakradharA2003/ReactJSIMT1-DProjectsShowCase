import './index.css'

const ProjectCard = props => {
  const {details} = props
  const {imageUrl, name} = details
  return (
    <li className="project-card">
      <img src={imageUrl} alt={name} className="project-image" />
      <p className="project-name">{name}</p>
    </li>
  )
}
export default ProjectCard
