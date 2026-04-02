import { useState, useCallback } from "react";
import FocusAreaCards from "./components/FocusAreaCards";
import PracticePlan from "./components/PracticePlan";
import History from "./components/History";
import MyDrills from "./components/MyDrills";
import "./App.css";

type Page = "plan" | "history" | "drills";

function App() {
  const [page, setPage] = useState<Page>("plan");
  const [selectedFocus, setSelectedFocus] = useState<string | null>(null);

  const handleSelect = useCallback((key: string) => {
    setSelectedFocus(key);
    window.scrollTo(0, 0);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedFocus(null);
    window.scrollTo(0, 0);
  }, []);

  const navigateTo = useCallback((p: Page) => {
    setPage(p);
    setSelectedFocus(null);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div
            className="header-brand"
            onClick={() => navigateTo("plan")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && navigateTo("plan")}
          >
            <div className="header-logo">&#x1F94F;</div>
            <div>
              <h1 className="header-title">Utah Ultimate</h1>
              <p className="header-subtitle">Practice Planner</p>
            </div>
          </div>
        </div>
      </header>
      <nav className="app-nav no-print">
        <div className="nav-inner">
          <button
            className={`nav-tab ${page === "plan" ? "active" : ""}`}
            onClick={() => navigateTo("plan")}
          >
            <span className="nav-icon">&#x1F4CB;</span>
            <span>Plan</span>
          </button>
          <button
            className={`nav-tab ${page === "history" ? "active" : ""}`}
            onClick={() => navigateTo("history")}
          >
            <span className="nav-icon">&#x1F4C5;</span>
            <span>History</span>
          </button>
          <button
            className={`nav-tab ${page === "drills" ? "active" : ""}`}
            onClick={() => navigateTo("drills")}
          >
            <span className="nav-icon">&#x1F3CB;&#xFE0F;</span>
            <span>My Drills</span>
          </button>
        </div>
      </nav>
      <main className="app-main">
        {page === "plan" && (
          <>
            {selectedFocus === null ? (
              <FocusAreaCards onSelect={handleSelect} />
            ) : (
              <PracticePlan
                focusKey={selectedFocus}
                onBack={handleBack}
                onSaved={() => {}}
              />
            )}
          </>
        )}
        {page === "history" && <History />}
        {page === "drills" && <MyDrills />}
      </main>
      <footer className="app-footer">
        <p>Utah Ultimate Practice Planner</p>
      </footer>
    </div>
  );
}

export default App;
