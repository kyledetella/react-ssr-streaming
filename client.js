import React from 'react'

const Frontend = (props) => {
  return (
    <span>
    <div>{props.name}</div>
    <button onClick={() => console.log(`Clicked: ${props.name}`)}>Click Me</button>
    </span>
  )
}

export default Frontend
