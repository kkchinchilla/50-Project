document.addEventListener("DOMContentLoaded", () => {
    const listsContainer = document.getElementById("lists-container");
    const addNewListButton = document.getElementById("add-new-list");

    const createListElement = (list, index) => {
        const listElement = document.createElement("div");
        listElement.className = "todo-app";

        const date = document.createElement("div");
        date.className = "date";
        date.textContent = `${new Date(list.date).toLocaleDateString()}`;
        listElement.appendChild(date);

        const row = document.createElement("div");
        row.className = "row";
        listElement.appendChild(row);

        const inputBox = document.createElement("input");
        inputBox.type = "text";
        inputBox.placeholder = "Add a Job";
        inputBox.className = "input-box";
        inputBox.id = `input-box-${index}`;
        inputBox.name = `input-box-${index}`;
        row.appendChild(inputBox);

        const addButton = document.createElement("button");
        addButton.textContent = "Add";
        addButton.onclick = () => addTask(inputBox, listElement.querySelector("ul"), index);
        row.appendChild(addButton);

        const ul = document.createElement("ul");
        ul.className = "list-container";
        listElement.appendChild(ul);

        if (Array.isArray(list.tasks)) {
            list.tasks.forEach(task => {
                addTaskToDOM(task, ul);
            });
        }

        const deleteButton = document.createElement("span");
        deleteButton.className = "delete-list";
        deleteButton.innerHTML = "\u00d7";
        deleteButton.onclick = () => {
            deleteList(index);
        };
        listElement.appendChild(deleteButton);

        return listElement;
    };

    const addTaskToDOM = (task, ul) => {
        let li = document.createElement("li");
        li.innerHTML = task.text;
        if (task.checked) {
            li.classList.add("checked");
        }
        ul.appendChild(li);
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        span.onclick = () => {
            li.remove();
            saveData();
        };
        li.appendChild(span);
    };

    const addTask = (inputBox, ul, listIndex) => {
        if (inputBox.value === '') {
            alert("You must write something");
        } else {
            let task = {
                text: inputBox.value,
                checked: false
            };
            addTaskToDOM(task, ul);
            saveData();
        }
        inputBox.value = "";
    };

    const deleteList = (index) => {
        let lists = JSON.parse(localStorage.getItem("lists")) || [];
        lists.splice(index, 1);
        localStorage.setItem("lists", JSON.stringify(lists));
        loadLists();
    };

    const loadLists = () => {
        let lists = JSON.parse(localStorage.getItem("lists")) || [];
        listsContainer.innerHTML = "";

        if (lists.length === 0) {
            lists.push({ tasks: [], date: new Date().toISOString() });
            localStorage.setItem("lists", JSON.stringify(lists));
        }

        lists.forEach((list, index) => {
            const listElement = createListElement(list, index);
            listsContainer.appendChild(listElement);
        });
    };

    const addList = () => {
        const lists = JSON.parse(localStorage.getItem("lists")) || [];
        const newList = { tasks: [], date: new Date().toISOString() };
        lists.push(newList);
        localStorage.setItem("lists", JSON.stringify(lists));
        loadLists();
    };

    const saveData = () => {
        const lists = [];
        document.querySelectorAll(".todo-app").forEach((listElement, index) => {
            const tasks = [];
            listElement.querySelectorAll("li").forEach(li => {
                tasks.push({
                    text: li.firstChild.textContent,
                    checked: li.classList.contains("checked")
                });
            });
            const dateElement = listElement.querySelector(".date").textContent.replace('Created on: ', '');
            lists.push({ tasks, date: new Date(dateElement).toISOString() });
        });
        localStorage.setItem("lists", JSON.stringify(lists));
    };

    listsContainer.addEventListener("click", function (e) {
        if (e.target.tagName === "LI") {
            e.target.classList.toggle("checked");
            saveData();
        }
    }, false);

    addNewListButton.addEventListener("click", addList);
    loadLists();
});
