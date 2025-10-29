/** @jsx createElement */
import { createElement, mount, useState } from './jsx-runtime';
import { Counter } from './counter';
import { TodoApp } from './todo-app';
import { Dashboard } from './dashboard';
import './style.css';

const App = () => {
  const [getActiveTab, setActiveTab] = useState<'counter' | 'todo' | 'dashboard'>('dashboard');
  
  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">
          <h1>⚡ JSX Lab 2</h1>
          <p className="nav-subtitle">Custom JSX Implementation</p>
        </div>
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${getActiveTab() === 'counter' ? 'active' : ''}`}
            onClick={() => setActiveTab('counter')}
          >
            🔢 Counter
          </button>
          <button 
            className={`nav-tab ${getActiveTab() === 'todo' ? 'active' : ''}`}
            onClick={() => setActiveTab('todo')}
          >
            📝 Todo
          </button>
          <button 
            className={`nav-tab ${getActiveTab() === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
        </div>
      </nav>
      
      <main className="main-content">
        {getActiveTab() === 'counter' && <Counter initialCount={0} />}
        {getActiveTab() === 'todo' && <TodoApp />}
        {getActiveTab() === 'dashboard' && <Dashboard />}
      </main>
      
      <footer className="footer">
        <p>Built with custom JSX runtime (no React) • MSc. Tran Vinh Khiem</p>
      </footer>
    </div>
  );
};

// Mount app and setup re-render
const root = document.getElementById('app');
if (root) {
  const render = () => {
    mount(<App />, root);
  };
  
  (window as any).__rerender = render;
  render();
}