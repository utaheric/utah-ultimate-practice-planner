import { useState, useCallback } from "react";
import FocusAreaCards from "./components/FocusAreaCards";
import PracticePlan from "./components/PracticePlan";
import "./App.css";

function App() {
  const [selectedFocus, setSelectedFocus] = useState<string | null>(null);

  const handleSelect = useCallback((key: string) => {
    setSelectedFocus(key);
    window.scrollTo(0, 0);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedFocus(null);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-logo">&#x1F94F;</div>
          <div>
            <h1 className="header-title">Utah Ultimate</h1>
            <p className="header-subtitle">Practice Planner</p>
          </div>
        </div>
      </header>
      <main className="app-main">
        {selectedFocus === null ? (
          <FocusAreaCards onSelect={handleSelect} />
        ) : (
          <PracticePlan focusKey={selectedFocus} onBack={handleBack} />
        )}
      </main>
      <footer className="app-footer">
        <p>Utah Ultimate Practice Planner</p>
      </footer>
    </div>
  );
}

export default App;
