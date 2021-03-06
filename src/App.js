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
const ADD_TODO = gql`
mutation addTodo($text: String!) {
  insert_todos(objects: {text: $text}) {
    returning {
      done
      id
      text
    }
  }
}
`
const DELETE_TODO = gql`
mutation deleteTodo($id: uuid!) {
  delete_todos(where: {id: {_eq: $id}}) {
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

  const [todotext, setTodotext] = React.useState('')
  const { loading, data, error } = useQuery(GET_TODOS)
  // Destructuring because it return an object
  const [toggleTodo] = useMutation(TOGGLE_TODO)
  // console.log(stuff)

  const [addTodo] = useMutation(ADD_TODO, {
    onCompleted: () => setTodotext('')
  })
  const [deleteTodo] = useMutation(DELETE_TODO)

  async function handleToggleTodo({ id, done }) {
    const data = await toggleTodo({ variables: {
      id: id,
      done: !done
    }})
    console('toggled data', data)
  }

  async function handleAddTodo(event) {
    event.preventDefault()
    //Checking blank todo's
    if(!todotext.trim()) return;

    //refetch queries adding such that todos will get load up asa we create todo!
    const  data = await addTodo({variables: { text: todotext }, refetchQueries: [{ query:GET_TODOS }]})
    console.log('Added todo', data)
    // setTodotext('')
  }

  async function handleDeleteTodo({ id }) {
    const isConfirmed = window.confirm('Do you want to delete this todo 📝')
    if(isConfirmed) {
      const data = await deleteTodo({ variables: { id }, update: cache => {
        //Read from cache
        const  prevData = cache.readQuery({ query: GET_TODOS })
        //Manually updates the todo
        const newTodos = prevData.todos.filter( todo => todo.id !== id )
        // Then write back to the cache
        cache.writeQuery( { query: GET_TODOS , data: { todos: newTodos}})
      }}) 
    }
  }

  if(loading) return <div>Loading...</div>
  if(error) return <div>500 error happend</div>

  return (
    <div className="vh-100 code flex flex-column 
    items-center bg-purple white pa3 fl-1">
      <h1 className="f2-1" aria-label="checklist">GraphQL Checklist ✅</h1>
      <form onSubmit={handleAddTodo} className="mb3">
        <input className="pa2 f4 b--dashed" 
        type="text"
        placeholder="Write your todo"
        onChange={ event => setTodotext(event.target.value)}
        value={todotext} //for context
        />
        {/* Adding () => because of each unique key is passing */}
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
          <button onClick={ () => handleDeleteTodo(todo)} className="bg-transparent bn f4">
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
