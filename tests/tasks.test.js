// Run with: npm test   (or: node --test)
const { test } = require("node:test");
const assert = require("node:assert");
const Tasks = require("../js/tasks.js");

function memoryStorage() {
  const data = {};
  return { getItem: (k) => (k in data ? data[k] : null), setItem: (k, v) => (data[k] = String(v)) };
}

test("adding a task trims the title and starts it as open", () => {
  const [task] = Tasks.addTask([], "  Boodschappen doen  ");
  assert.strictEqual(task.title, "Boodschappen doen");
  assert.strictEqual(task.done, false);
});

test("empty titles are not added", () => {
  assert.deepStrictEqual(Tasks.addTask([], "   "), []);
});

test("toggling marks a task done and back", () => {
  let tasks = Tasks.addTask([], "Sporten");
  const id = tasks[0].id;
  tasks = Tasks.toggleTask(tasks, id);
  assert.strictEqual(tasks[0].done, true);
  tasks = Tasks.toggleTask(tasks, id);
  assert.strictEqual(tasks[0].done, false);
});

test("renaming changes the title, and an empty name deletes the task", () => {
  let tasks = Tasks.addTask([], "Oud");
  const id = tasks[0].id;
  tasks = Tasks.renameTask(tasks, id, "Nieuw");
  assert.strictEqual(tasks[0].title, "Nieuw");
  assert.deepStrictEqual(Tasks.renameTask(tasks, id, " "), []);
});

test("filters and counters", () => {
  let tasks = ["A", "B", "C"].reduce((list, t) => Tasks.addTask(list, t), []);
  tasks = Tasks.toggleTask(tasks, tasks[1].id);
  assert.strictEqual(Tasks.countOpen(tasks), 2);
  assert.deepStrictEqual(Tasks.filterTasks(tasks, "open").map((t) => t.title), ["A", "C"]);
  assert.deepStrictEqual(Tasks.filterTasks(tasks, "klaar").map((t) => t.title), ["B"]);
  assert.strictEqual(Tasks.filterTasks(tasks, "alles").length, 3);
  assert.deepStrictEqual(Tasks.clearDone(tasks).map((t) => t.title), ["A", "C"]);
});

test("functions never change the original list", () => {
  const tasks = Tasks.addTask([], "Blijf zoals je bent");
  Tasks.toggleTask(tasks, tasks[0].id);
  Tasks.deleteTask(tasks, tasks[0].id);
  assert.strictEqual(tasks.length, 1);
  assert.strictEqual(tasks[0].done, false);
});

test("saving and loading keeps the tasks; broken data gives an empty list", () => {
  const storage = memoryStorage();
  const tasks = Tasks.toggleTask(Tasks.addTask([], "Opslaan"), undefined);
  Tasks.save(tasks, storage);
  assert.deepStrictEqual(Tasks.load(storage).map((t) => t.title), ["Opslaan"]);
  storage.setItem(Tasks.STORAGE_KEY, "{kapot");
  assert.deepStrictEqual(Tasks.load(storage), []);
});
