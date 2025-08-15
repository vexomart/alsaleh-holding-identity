import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";

// Simple test component to verify React is working
const TestComponent = () => {
  const [count, setCount] = React.useState(0);
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>React Test</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TestComponent />} />
        <Route path="/index" element={<Index />} />
        <Route path="*" element={<TestComponent />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;