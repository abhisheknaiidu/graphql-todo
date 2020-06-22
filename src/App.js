import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks'
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
const TOGGLE_TODO = gql`
mutation toggleTodo($id: uuid!, $done: Boolean!) {
  update_todos(where: {id: { _eq: $id }}, _set: { done: $done }) {
    returning {
      done
      id
      text
    }
  }
}
`

// List Todos
// Add Todos
// Toggle Todos
// Delete Todos
function App() {

  const { loading, data, error } = useQuery(GET_TODOS)
  // Destructuring because it return an object
  const [toggleTodo] = useMutation(TOGGLE_TODO)
  // console.log(stuff)

  async function handleToggleTodo({ id, done }) {
    const data = await toggleTodo({ variables: {
      id: id,
      done: !done
    }})
    console.log(data)
  }

  if(loading) return <div>Loading...</div>
  if(error) return <div>500 error happend</div>

  return (
    <div className="vh-100 code flex flex-column 
    items-center bg-purple white pa3 fl-1">
      <h1 className="f2-1" aria-label="checklist">GraphQL Checklist ✅</h1>
      <form className="mb3">
        <input className="pa2 f4 b--dashed" 
        type="text"
        placeholder="Write your todo" />
        <button className="pa2 f4 bg-green" type="submt"> 
        Create 
        </button>
      </form>
      <div className="flex items-center justify-center flex-column">
      {data.todos.map(todo => (
        // () => ensures that we get the particular todo only
        <p onDoubleClick={() => handleToggleTodo(todo)} key={todo.id}>
          <span className={`pointer list pa1 f3 ${todo.done && 'strike'} `}>
            {todo.text}
          </span>
          <button className="bg-transparent bn f4">
            <span className="red">
              &times;
            </span> 
          </button>
        </p>
      ))}
      </div>
    </div>
  );
}

export default App;
