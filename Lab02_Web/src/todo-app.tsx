/** @jsx createElement */
import { createElement, useState, ComponentProps } from './jsx-runtime';
import { Button, Input, Form } from './component';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface TodoItemProps extends ComponentProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoItem = (props: TodoItemProps) => {
  const { todo, onToggle, onDelete } = props;
  
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input 
        type="checkbox" 
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="todo-checkbox"
      />
      <span className="todo-text">{todo.text}</span>
      <button 
        className="todo-delete"
        onClick={() => onDelete(todo.id)}
      >
        🗑️
      </button>
    </div>
  );
};

export const TodoApp = () => {
  const [getTodos, setTodos] = useState<Todo[]>([]);
  const [getInputValue, setInputValue] = useState('');
  const [getFilter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  
  const addTodo = (e: Event) => {
    e.preventDefault();
    const text = getInputValue().trim();
    
    if (text) {
      const newTodo: Todo = {
        id: Date.now(),
        text,
        completed: false,
        createdAt: new Date()
      };
      
      setTodos([...getTodos(), newTodo]);
      setInputValue('');
    }
  };
  
  const toggleTodo = (id: number) => {
    setTodos(
      getTodos().map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  
  const deleteTodo = (id: number) => {
    setTodos(getTodos().filter(todo => todo.id !== id));
  };
  
  const clearCompleted = () => {
    setTodos(getTodos().filter(todo => !todo.completed));
  };
  
  const todos = getTodos();
  const filteredTodos = todos.filter(todo => {
    if (getFilter() === 'active') return !todo.completed;
    if (getFilter() === 'completed') return todo.completed;
    return true;
  });
  
  const totalCount = todos.length;
  const completedCount = todos.filter(t => t.completed).length;
  const activeCount = totalCount - completedCount;
  
  return (
    <div className="todo-app">
      <div className="todo-header">
        <h2>📝 Todo List</h2>
      </div>
      
      <Form onSubmit={addTodo} className="todo-form">
        <Input 
          value={getInputValue()}
          onChange={(e: any) => setInputValue(e.target.value)}
          placeholder="What needs to be done?"
          className="todo-input"
        />
        <Button type="submit" className="btn-primary">Add Todo</Button>
      </Form>
      
      <div className="todo-filters">
        <button 
          className={`filter-btn ${getFilter() === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({totalCount})
        </button>
        <button 
          className={`filter-btn ${getFilter() === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active ({activeCount})
        </button>
        <button 
          className={`filter-btn ${getFilter() === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed ({completedCount})
        </button>
      </div>
      
      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            {getFilter() === 'completed' 
              ? '✨ No completed tasks yet' 
              : '🎯 No tasks yet. Add one above!'}
          </div>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem 
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))
        )}
      </div>
      
      {completedCount > 0 && (
        <div className="todo-footer">
          <button className="btn-secondary" onClick={clearCompleted}>
            Clear Completed
          </button>
        </div>
      )}
    </div>
  );
};