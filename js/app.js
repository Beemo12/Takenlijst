/**
 * Page logic: draws the list and handles clicks and typing.
 * The task rules themselves live in tasks.js.
 */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  let tasks = Tasks.load(localStorage);
  let filter = "alles";
  let editingId = null;

  function update(newTasks) {
    tasks = newTasks;
    Tasks.save(tasks, localStorage);
    render();
  }

  // ---------- Drawing the list ----------

  function renderTask(task) {
    const li = document.createElement("li");
    li.className = "task" + (task.done ? " done" : "");
    li.dataset.id = task.id;

    if (task.id === editingId) {
      const input = document.createElement("input");
      input.className = "edit";
      input.value = task.title;
      input.setAttribute("aria-label", "Taak wijzigen");
      let finished = false;
      const finish = (keep) => {
        if (finished) return;
        finished = true;
        editingId = null;
        if (keep) update(Tasks.renameTask(tasks, task.id, input.value));
        else render();
      };
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") finish(true);
        if (e.key === "Escape") finish(false);
      });
      input.addEventListener("blur", () => finish(true));
      li.append(input);
      return li;
    }

    const check = document.createElement("input");
    check.type = "checkbox";
    check.className = "check";
    check.checked = task.done;
    check.id = `task-${task.id}`;
    check.addEventListener("change", () => update(Tasks.toggleTask(tasks, task.id)));

    const label = document.createElement("label");
    label.className = "title";
    label.htmlFor = check.id;
    label.textContent = task.title; // textContent, so a title can never inject HTML
    label.addEventListener("dblclick", (e) => {
      e.preventDefault();
      startEditing(task.id);
    });

    const edit = document.createElement("button");
    edit.className = "icon-button";
    edit.textContent = "Wijzig";
    edit.setAttribute("aria-label", `Wijzig "${task.title}"`);
    edit.addEventListener("click", () => startEditing(task.id));

    const remove = document.createElement("button");
    remove.className = "icon-button danger";
    remove.textContent = "Verwijder";
    remove.setAttribute("aria-label", `Verwijder "${task.title}"`);
    remove.addEventListener("click", () => {
      update(Tasks.deleteTask(tasks, task.id));
      $("new-title").focus();
    });

    li.append(check, label, edit, remove);
    return li;
  }

  function startEditing(id) {
    editingId = id;
    render();
  }

  function render() {
    const visible = Tasks.filterTasks(tasks, filter);
    $("list").replaceChildren(...visible.map(renderTask));

    // Focus the edit box straight away (once it's on the page), so no keystrokes get lost
    const editInput = $("list").querySelector(".edit");
    if (editInput) {
      editInput.focus();
      editInput.select();
    }

    const open = Tasks.countOpen(tasks);
    const done = tasks.length - open;
    $("summary").textContent = tasks.length
      ? `${open} ${open === 1 ? "taak" : "taken"} open, ${done} klaar`
      : "Nog geen taken";

    const empty = $("empty");
    empty.hidden = visible.length > 0;
    empty.textContent = !tasks.length
      ? "Je lijst is leeg. Typ hierboven je eerste taak."
      : filter === "open"
        ? "Alles is af. Lekker bezig!"
        : "Nog niets afgerond. Vink een taak af als hij klaar is.";

    $("list-footer").hidden = done === 0;
  }

  // ---------- Adding, filtering, clearing ----------

  $("new-task").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("new-title");
    if (!input.value.trim()) return;
    update(Tasks.addTask(tasks, input.value));
    input.value = "";
    input.focus();
  });

  document.querySelectorAll("[data-filter]").forEach((button) =>
    button.addEventListener("click", () => {
      filter = button.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach((b) => b.setAttribute("aria-pressed", b === button));
      render();
    })
  );

  $("clear-done").addEventListener("click", () => update(Tasks.clearDone(tasks)));

  render();
})();
