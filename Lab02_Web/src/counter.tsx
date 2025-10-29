/** @jsx createElement */
import { createElement, useState, ComponentProps } from './jsx-runtime';
import { Button } from './component';

export interface CounterProps extends ComponentProps {
  initialCount?: number;
}

export const Counter = (props: CounterProps) => {
  const { initialCount = 0 } = props;
  const [getCount, setCount] = useState(initialCount);
  
  const increment = () => setCount(getCount() + 1);
  const decrement = () => setCount(getCount() - 1);
  const reset = () => setCount(initialCount);
  
  return (
    <div className="counter-container">
      <h2 className="counter-title">Counter App</h2>
      <div className="counter-display">
        <span className="counter-value">{getCount()}</span>
      </div>
      <div className="counter-buttons">
        <Button onClick={decrement} className="btn-danger">➖ Decrement</Button>
        <Button onClick={reset} className="btn-warning">🔄 Reset</Button>
        <Button onClick={increment} className="btn-success">➕ Increment</Button>
      </div>
    </div>
  );
};