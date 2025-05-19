import { useEffect } from "react";
import { useViewState, ViewName } from "./UI/ViewState";

export function useViewRouting():ViewName {
  const view    = useViewState((s) => s.view);
  const setView = useViewState((s) => s.setView);

  // ! === LLM generated ===

  const VIEW_BY_PATH: Record<string, ViewName> = {
    "/":                "app",
    "/piece-library":   "piece library",
    "/mark":            "mark",
    "/browser":         "browser",
  };
  
  const PATH_BY_VIEW: Record<ViewName, string> = {
    "app":           "/",
    "piece library": "/piece-library",
    "mark":          "/mark",
    "browser":       "/browser"
  };

  // On mount: seed view from URL + listen for back/forward
  useEffect(() => {
    const initial = VIEW_BY_PATH[window.location.pathname] || "app";
    setView(initial);

    const onPop = () => {
      const v = VIEW_BY_PATH[window.location.pathname] || "app";
      setView(v);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [setView]);

  // Whenever view changes, push new URL
  useEffect(() => {
    const desiredPath = PATH_BY_VIEW[view] || "/";
    if (window.location.pathname !== desiredPath) {
      window.history.pushState({}, "", desiredPath);
    }
  }, [view]);

  return view;
}