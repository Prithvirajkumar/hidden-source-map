import "./App.css";

const breakTheApp = () => {
  throw new Error("Broken");
};

function App() {
  return (
    <div className="App">
      <button onClick={breakTheApp}>Break Me</button>
    </div>
  );
}

export default App;
