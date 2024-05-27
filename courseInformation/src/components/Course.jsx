const Header = ({course}) => <h1>{course}</h1>
const Part = ({part}) => part
const Content = ({course}) => {
  return (
    <>
      <Part part={course.parts.map(part => <p key={part.id}>{part.name + ' ' + part.exercises}</p>
        )}/>
    </>
  )
}

const Total = ({course}) => {
  const total = course.reduce((s, p) => s + p.exercises, 0)
  return (
    <h4>Total {total}</h4>
  )
}

const Course = ({course}) => 
  <>
    <Header course={course.name} />
    <Content course={course} />
    <Total course={course.parts} />
  </>

  

  export default Course