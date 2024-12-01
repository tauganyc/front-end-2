const API_URL = "https://674bdbe671933a4e88562e08.mockapi.io/api/2/user";

const tableBody = document.querySelector("#data-table tbody");
const form = document.querySelector("#data-form");
const searchInput = document.querySelector("#search");
let items = [];


const fetchData = async () => {
    try {
        const response = await fetch(API_URL);
        items = await response.json();
        displayData(items);
    } catch (error) {
        alert("Erro ao carregar usuários");
    }
};


const displayData = (data) => {
    tableBody.innerHTML = "";
    data.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.email}</td>
      <td>${item.age}</td>
      <td>${item.status}</td>
      <td>
        <button onclick="editItem(${item.id})">Edit</button>
        <button onclick="deleteItem(${item.id})">Delete</button>
      </td>
    `;
        tableBody.appendChild(row);
    });
};


form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.querySelector("#item-id").value;
    const newItem = {
        name: document.querySelector("#name").value,
        email: document.querySelector("#email").value,
        age: document.querySelector("#age").value,
        status: document.querySelector("#status").value,
    };

    try {
        let response;
        if (id) {
            response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newItem),
            });
            document.querySelector("#form-title").innerText = "Adicionar novo usuário";
        } else {

            response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newItem),
            });
        }
        if (response.ok) {
            fetchData();
            form.reset();
        } else {
            alert("Erro ao salvar usuário");
        }
    } catch (error) {
        alert("Erro ao salvar usuário");
    }
});


const deleteItem = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (response.ok) fetchData();
        else alert("Erro ao deletar usuário");
    } catch (error) {
        alert("Erro ao deletar usuário");
    }
};


const editItem = (id) => {
    const item = items.find((item) => item.id === id.toString());
    document.querySelector("#item-id").value = item.id;
    document.querySelector("#name").value = item.name;
    document.querySelector("#email").value = item.email;
    document.querySelector("#age").value = item.age;
    document.querySelector("#status").value = item.status;
    document.querySelector("#form-title").innerText = "Editar usuário";
};


searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const filteredItems = items.filter((item) =>
        Object.values(item).some((value) => value.toString().toLowerCase().includes(query))
    );
    displayData(filteredItems);
});


document.querySelectorAll("th[data-column]").forEach((header) => {
    header.addEventListener("click", () => {
        const column = header.dataset.column;
        const order = header.dataset.order === "asc" ? "desc" : "asc";
        header.dataset.order = order;

        const sortedItems = [...items].sort((a, b) => {
            if (order === "asc") return a[column] > b[column] ? 1 : -1;
            return a[column] < b[column] ? 1 : -1;
        });

        displayData(sortedItems);
    });
});


fetchData();
