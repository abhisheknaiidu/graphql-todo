import React from 'react';
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

const GET_TODOS = gql`
query getTodos {
  todos {
    done
    id
    text
  }
}
`

// List Todos
// Add Todos
// Toggle Todos
// Delete Todos
function App() {

  const { loading, data } = useQuery(GET_TODOS)
  // console.log(stuff)

  if(loading) return <div>Loading...</div>

  return (
    <div>
      {data.todos.map(todo => (
        <p key={todo.id}>
          <span>
            {todo.text}
          </span>
          <button> &times; </button>
        </p>
      ))}
    </div>
  );
}

export default App;
