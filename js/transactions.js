document.addEventListener("DOMContentLoaded", () => {
    loadTransactions();
    loadCategories();

    const form = document.getElementById("categoryForm");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const input = document.getElementById("categoryInput");
        const name = input.value.trim();
        if (!name) return;

        await fetch("/add-category", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name })
        });

        input.value = "";
        loadCategories();
    });
});

async function loadTransactions() {
    const res = await fetch("/transactions");
    const data = await res.json();

    const history = document.getElementById("history-list");
    if (!history) return;
    history.innerHTML = "";

    data.forEach(t => {
        const li = document.createElement("li");
        li.className = "history-item";
        li.innerHTML = `
            <strong>${t.amount}</strong> — ${t.description}
            <span>${t.date}</span>
        `;
        history.appendChild(li);
    });
}

async function loadCategories() {
    const res = await fetch("/categories");
    const data = await res.json();

    const list = document.getElementById("category-list");
    list.innerHTML = "";

    data.forEach(cat => {
        const li = document.createElement("li");
        li.className = "category-item";
        li.textContent = cat.type_name;
        list.appendChild(li);
    });
}
document.getElementById("addTransactionBtn").addEventListener("click", () => {
    const form = document.getElementById("transactionForm");
    form.style.display = form.style.display === "none" ? "block" : "none";
});

document.getElementById("transactionForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const amount = document.getElementById("amountInput").value;
    const description = document.getElementById("descriptionInput").value;
    const date = document.getElementById("dateInput").value;

    await fetch("/add-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, description, date })
    });

    loadTransactions();
});