import { useState, useCallback, useEffect } from "react";
import FocusAreaCards from "./components/FocusAreaCards";
import PracticePlan from "./components/PracticePlan";
import PlanBuilder from "./components/PlanBuilder";
import History from "./components/History";
import MyDrills from "./components/MyDrills";
import SeasonCalendar from "./components/SeasonCalendar";
import Roster from "./components/Roster";
import SharedPlanView from "./components/SharedPlanView";
import { getShareDataFromHash, type SharedPractice } from "./data/sharing";
import type { SavedPractice } from "./data/storage";
import "./App.css";

type Page = "plan" | "history" | "drills" | "season" | "roster";

function App() {
  const [page, setPage] = useState<Page>("plan");
  const [selectedFocus, setSelectedFocus] = useState<string | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [builderSeed, setBuilderSeed] = useState<SavedPractice | null>(null);
  const [sharedPractice, setSharedPractice] = useState<SharedPractice | null>(
    () => getShareDataFromHash()
  );

  useEffect(() => {
    const handleHashChange = () => {
      const data = getShareDataFromHash();
      if (data) setSharedPractice(data);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleSelect = useCallback((key: string) => {
    setSelectedFocus(key);
    setShowBuilder(false);
    setBuilderSeed(null);
    window.scrollTo(0, 0);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedFocus(null);
    setShowBuilder(false);
    setBuilderSeed(null);
    window.scrollTo(0, 0);
  }, []);

  const handleBuildCustom = useCallback(() => {
    setShowBuilder(true);
    setSelectedFocus(null);
    setBuilderSeed(null);
    window.scrollTo(0, 0);
  }, []);

  const handleRepeatPractice = useCallback((practice: SavedPractice) => {
    setPage("plan");
    setShowBuilder(true);
    setSelectedFocus(null);
    setBuilderSeed(practice);
    window.scrollTo(0, 0);
  }, []);

  const navigateTo = useCallback((p: Page) => {
    setPage(p);
    setSelectedFocus(null);
    setShowBuilder(false);
    setBuilderSeed(null);
    window.scrollTo(0, 0);
  }, []);

  if (sharedPractice) {
    return (
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <div className="header-brand">
                <div className="header-logo">UU</div>
              <div>
                <h1 className="header-title">Utah Ultimate</h1>
                <p className="header-subtitle">Practice Planner</p>
              </div>
            </div>
          </div>
        </header>
        <main className="app-main">
          <SharedPlanView
            practice={sharedPractice}
            onClose={() => {
              setSharedPractice(null);
              window.history.replaceState(null, "", window.location.pathname);
            }}
          />
        </main>
        <footer className="app-footer">
          <p>Utah Ultimate Practice Planner</p>
        </footer>
      </div>
    );
  }

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
            <div className="header-logo">UU</div>
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
            aria-label="Plan"
          >
            <span className="nav-icon">TP</span>
            <span>Plan</span>
          </button>
          <button
            className={`nav-tab ${page === "history" ? "active" : ""}`}
            onClick={() => navigateTo("history")}
            aria-label="History"
          >
            <span className="nav-icon">HI</span>
            <span>History</span>
          </button>
          <button
            className={`nav-tab ${page === "season" ? "active" : ""}`}
            onClick={() => navigateTo("season")}
            aria-label="Season"
          >
            <span className="nav-icon">SE</span>
            <span>Season</span>
          </button>
          <button
            className={`nav-tab ${page === "roster" ? "active" : ""}`}
            onClick={() => navigateTo("roster")}
            aria-label="Roster"
          >
            <span className="nav-icon">RO</span>
            <span>Roster</span>
          </button>
          <button
            className={`nav-tab ${page === "drills" ? "active" : ""}`}
            onClick={() => navigateTo("drills")}
            aria-label="Drill Library"
          >
            <span className="nav-icon">DL</span>
            <span>Drill Library</span>
          </button>
        </div>
      </nav>
      <main className="app-main">
        {page === "plan" && (
          <>
            {showBuilder ? (
              <PlanBuilder
                key={builderSeed?.id ?? "new-custom"}
                onBack={handleBack}
                onSaved={() => {}}
                initialPractice={
                  builderSeed
                    ? {
                        date: builderSeed.date,
                        schedule: builderSeed.schedule,
                      }
                    : null
                }
              />
            ) : selectedFocus === null ? (
              <FocusAreaCards
                onSelect={handleSelect}
                onBuildCustom={handleBuildCustom}
                onRepeatPractice={handleRepeatPractice}
                onOpenHistory={() => navigateTo("history")}
                onOpenRoster={() => navigateTo("roster")}
                onOpenSeason={() => navigateTo("season")}
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
        {page === "history" && <History onRepeatPractice={handleRepeatPractice} />}
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
