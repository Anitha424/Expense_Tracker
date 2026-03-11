let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function updateUI() {
    const table = document.getElementById("expenseList");
    table.innerHTML = "";

    let total = 0;

    expenses.forEach((exp, index) => {
        total += exp.amount;

        table.innerHTML += `
        <tr>
            <td>${exp.category}</td>
            <td>₹${exp.amount}</td>
            <td>${exp.description}</td>
            <td><button class="delete-btn" onclick="deleteExpense(${index})">X</button></td>
        </tr>`;
    });

    document.getElementById("totalAmount").innerText = total;

    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function addExpense() {
    const category = document.getElementById("category").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const description = document.getElementById("description").value;

    if (!category || !amount || !description) {
        alert("Please fill all fields");
        return;
    }

    expenses.push({ category, amount, description });
    updateUI();

    document.getElementById("category").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("description").value = "";
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    updateUI();
}

updateUI();
