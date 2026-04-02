import { useState, useCallback } from "react";
import FocusAreaCards from "./components/FocusAreaCards";
import PracticePlan from "./components/PracticePlan";
import PlanBuilder from "./components/PlanBuilder";
import History from "./components/History";
import MyDrills from "./components/MyDrills";
import SeasonCalendar from "./components/SeasonCalendar";
import Roster from "./components/Roster";
import "./App.css";

type Page = "plan" | "history" | "drills" | "season" | "roster";

function App() {
  const [page, setPage] = useState<Page>("plan");
  const [selectedFocus, setSelectedFocus] = useState<string | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);

  const handleSelect = useCallback((key: string) => {
    setSelectedFocus(key);
    setShowBuilder(false);
    window.scrollTo(0, 0);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedFocus(null);
    setShowBuilder(false);
    window.scrollTo(0, 0);
  }, []);

  const handleBuildCustom = useCallback(() => {
    setShowBuilder(true);
    setSelectedFocus(null);
    window.scrollTo(0, 0);
  }, []);

  const navigateTo = useCallback((p: Page) => {
    setPage(p);
    setSelectedFocus(null);
    setShowBuilder(false);
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
            className={`nav-tab ${page === "season" ? "active" : ""}`}
            onClick={() => navigateTo("season")}
          >
            <span className="nav-icon">&#x1F5D3;&#xFE0F;</span>
            <span>Season</span>
          </button>
          <button
            className={`nav-tab ${page === "roster" ? "active" : ""}`}
            onClick={() => navigateTo("roster")}
          >
            <span className="nav-icon">&#x1F465;</span>
            <span>Roster</span>
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
            {showBuilder ? (
              <PlanBuilder onBack={handleBack} onSaved={() => {}} />
            ) : selectedFocus === null ? (
              <FocusAreaCards
                onSelect={handleSelect}
                onBuildCustom={handleBuildCustom}
              />
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
        {page === "season" && <SeasonCalendar />}
        {page === "roster" && <Roster />}
        {page === "drills" && <MyDrills />}
      </main>
      <footer className="app-footer">
        <p>Utah Ultimate Practice Planner</p>
      </footer>
    </div>
  );
}

export default App;
