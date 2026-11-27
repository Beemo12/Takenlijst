/**
 * Task logic: adding, changing, filtering and saving tasks.
 * No browser code here, so it can be tested with Node (see tests/tasks.test.js).
 * Every function returns a new list instead of changing the old one.
 */
(function (root) {
  "use strict";

  const STORAGE_KEY = "takenlijst.v1";

  let counter = 0;
  const newId = () => `${Date.now().toString(36)}-${(counter++).toString(36)}`;

  function addTask(tasks, title) {
    const clean = title.trim();
    if (!clean) return tasks;
    return [...tasks, { id: newId(), title: clean, done: false }];
  }

  function toggleTask(tasks, id) {
    return tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  }

  /** Renames a task. An empty title deletes it, like in most to-do apps. */
  function renameTask(tasks, id, title) {
    const clean = title.trim();
    if (!clean) return deleteTask(tasks, id);
    return tasks.map((t) => (t.id === id ? { ...t, title: clean } : t));
  }

  function deleteTask(tasks, id) {
    return tasks.filter((t) => t.id !== id);
  }

  function clearDone(tasks) {
    return tasks.filter((t) => !t.done);
  }

  const FILTERS = {
    alles: () => true,
    open: (t) => !t.done,
    klaar: (t) => t.done,
  };

  function filterTasks(tasks, filter) {
    return tasks.filter(FILTERS[filter] || FILTERS.alles);
  }

  function countOpen(tasks) {
    return tasks.filter((t) => !t.done).length;
  }

  function save(tasks, storage) {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      return true;
    } catch {
      return false;
    }
  }

  function load(storage) {
    try {
      const data = JSON.parse(storage.getItem(STORAGE_KEY));
      if (!Array.isArray(data)) return [];
      return data
        .filter((t) => t && typeof t.title === "string" && t.title.trim())
        .map((t) => ({ id: typeof t.id === "string" ? t.id : newId(), title: t.title, done: Boolean(t.done) }));
    } catch {
      return [];
    }
  }

  const Tasks = { STORAGE_KEY, addTask, toggleTask, renameTask, deleteTask, clearDone, filterTasks, countOpen, save, load };

  if (typeof module !== "undefined" && module.exports) module.exports = Tasks;
  else root.Tasks = Tasks;
})(globalThis);
