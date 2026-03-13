import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);
  const reset = () => setCount(0);

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">React Counter</h1>

        <div className="counter">{count}</div>

        <div className="buttons">
          <button className="btn increment" onClick={increment}>
            Increment
          </button>

          <button className="btn decrement" onClick={decrement}>
            Decrement
          </button>

          <button className="btn reset" onClick={reset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;