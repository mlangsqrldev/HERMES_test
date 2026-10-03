import { load } from "@tauri-apps/plugin-store";
import defaultTemplates from "../assets/default_templates.json";

export const isTauri = () => {
  return typeof window !== "undefined" && Boolean(window.__TAURI_INTERNALS__);
};

class BrowserStore {
  constructor(name = "templates.json") {
    this.name = name;
  }

  _getData() {
    try {
      const stored = localStorage.getItem(`hermes_${this.name}`);
      if (stored) {
        return JSON.parse(stored);
      }
      if (this.name === "templates.json" && defaultTemplates) {
        localStorage.setItem(`hermes_${this.name}`, JSON.stringify(defaultTemplates));
        return defaultTemplates;
      }
      return {};
    } catch {
      return this.name === "templates.json" && defaultTemplates ? defaultTemplates : {};
    }
  }

  async get(key) {
    const data = this._getData();
    return data[key] !== undefined ? data[key] : null;
  }

  async set(key, val) {
    const data = this._getData();
    data[key] = val;
    localStorage.setItem(`hermes_${this.name}`, JSON.stringify(data));
  }

  async save() {
    // Already persisted to localStorage
  }

  async keys() {
    return Object.keys(this._getData());
  }
}

export const getAppStore = async (name = "templates.json", options = { autoSave: true }) => {
  if (isTauri()) {
    try {
      return await load(name, options);
    } catch (e) {
      console.warn("Tauri store load failed, falling back to browser storage:", e);
      return new BrowserStore(name);
    }
  }
  return new BrowserStore(name);
};
