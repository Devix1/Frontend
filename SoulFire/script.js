const dateElement = document.getElementById('current-date');
const today = new Date();
const salesIncomeElement = document.getElementById('salesIncome');
const expenseTotalElement = document.getElementById('expenseTotal');
const activeClientsElement = document.getElementById('activeClients');
const userNameElement = document.getElementById('userName');
const dashboard = document.getElementById('dashboard');
const stockCountElement = document.getElementById('stockCount');
const salesList = document.getElementById('salesList');
const expenseList = document.getElementById('expenseList');
const clientList = document.getElementById('clientList');
let totalSalesIncome = 0;
let totalExpenses = 0;
let activeClients = 0;
let stockCount = 0; // Глобальная переменная для отслеживания количества товара

const formattedDate = today.toLocaleDateString('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
});

dateElement.textContent = formattedDate;
updateStockDisplay(); // Обновляем отображение количества товара

// Функции для модальных окон
function openModal(type) {
    if (type === 'sale') {
        document.getElementById("saleModal").style.display = "block";
        document.getElementById("modal-sale-date").value = formattedDate;
    } else if (type === 'expense') {
        document.getElementById("expenseModal").style.display = "block";
        document.getElementById("modal-expense-date").value = formattedDate;
        document.getElementById("modal-expense-item").value = "";
        document.getElementById("modal-expense-price").value = "";
    } else if (type === 'client') {
        document.getElementById("clientModal").style.display = "block";
        document.getElementById("modal-client-name").value = "";
    }
}

function closeModal(type) {
    if (type === 'sale') {
        document.getElementById("saleModal").style.display = "none";
    } else if (type === 'expense') {
        document.getElementById("expenseModal").style.display = "none";
    } else if (type === 'extra') {
        document.getElementById("extraExpenseModal").style.display = "none";
    } else if (type === 'client') {
        document.getElementById("clientModal").style.display = "none";
    } else if (type === 'name') {
        document.getElementById("nameModal").style.display = "none";
    } else if (type === 'editName') {
        document.getElementById("editNameModal").style.display = "none";
    } else if (type === 'manageStock') {
        document.getElementById("manageStockModal").style.display = "none";
    }
}

function saveSale() {
    const date = document.getElementById("modal-sale-date").value;
    const product = document.getElementById("modal-sale-product").value;
    const priceText = document.getElementById("modal-sale-price").value;
    const client = document.getElementById("modal-sale-client").value;

    let price = parseFloat(priceText.replace('Р', '').replace(',', '.'));
    if (isNaN(price)) price = 0;

    if (stockCount > 0) { // Проверяем, есть ли товар на складе
        totalSalesIncome += price;
        salesIncomeElement.textContent = `${totalSalesIncome.toFixed(2)} ₽`;
        stockCount -= 1; // Уменьшаем количество товара на 1
        updateStockDisplay();

        const salesList = document.getElementById('salesList');
        const newSale = document.createElement("li");
        newSale.innerHTML = `ДАТА: ${date}, ТОВАР: ${product}, ЦЕНА: ${priceText}, КЛИЕНТ: ${client} <button class="delete-btn" onclick="deleteSale(this)">Удалить</button>`;
        salesList.insertBefore(newSale, salesList.firstChild);

        document.getElementById("modal-sale-date").value = formattedDate;
        document.getElementById("modal-sale-product").value = "";
        document.getElementById("modal-sale-price").value = "";
        document.getElementById("modal-sale-client").value = "";
    } else {
        alert("Товаров на складе нет!");
    }

    closeModal('sale');
}

function deleteSale(button) {
    const li = button.parentElement;
    const priceText = li.textContent.match(/ЦЕНА: (\d+(?:\.\d+)?)/)[1];
    const price = parseFloat(priceText.replace('Р', '').replace(',', '.'));
    totalSalesIncome -= price;
    salesIncomeElement.textContent = `${totalSalesIncome.toFixed(2)} ₽`;
    stockCount += 1; // Увеличиваем количество товара на 1
    updateStockDisplay();
    li.parentElement.removeChild(li);
}

function addExpenseForm() {
    const date = document.getElementById("modal-expense-date").value;
    const item = document.getElementById("modal-expense-item").value;
    const priceText = document.getElementById("modal-expense-price").value;

    document.getElementById("modal-extra-expense-date").value = date;
    document.getElementById("modal-extra-expense-item").value = item;
    document.getElementById("modal-extra-expense-price").value = priceText;

    document.getElementById("expenseModal").style.display = "none";
    document.getElementById("extraExpenseModal").style.display = "block";
}

function saveExpense() {
    const date = document.getElementById("modal-extra-expense-date").value;
    const item = document.getElementById("modal-extra-expense-item").value;
    const priceText = document.getElementById("modal-extra-expense-price").value;

    let price = parseFloat(priceText.replace('Р', '').replace(',', '.'));
    if (isNaN(price)) price = 0;

    totalExpenses += price;
    expenseTotalElement.textContent = `${totalExpenses.toFixed(2)} ₽`;

    const expenseList = document.getElementById("expenseList");
    const newExpense = document.createElement("li");
    newExpense.innerHTML = `ДАТА: ${date}, ПОКУПКА: ${item}, ЦЕНА: ${priceText} <button class="delete-btn" onclick="deleteExpense(this)">Удалить</button>`;
    expenseList.insertBefore(newExpense, expenseList.firstChild);

    document.getElementById("modal-extra-expense-date").value = formattedDate;
    document.getElementById("modal-extra-expense-item").value = "";
    document.getElementById("modal-extra-expense-price").value = "";

    closeModal('extra');
}

function deleteExpense(button) {
    const li = button.parentElement;
    const priceText = li.textContent.match(/ЦЕНА: (\d+(?:\.\d+)?)/)[1];
    const price = parseFloat(priceText.replace('Р', '').replace(',', '.'));
    totalExpenses -= price;
    expenseTotalElement.textContent = `${totalExpenses.toFixed(2)} ₽`;
    li.parentElement.removeChild(li);
}

function saveClient() {
    const clientName = document.getElementById("modal-client-name").value.trim();
    const clientCall = document.getElementById("modal-client-numcall").value.trim();
    if (clientName !== "") {
        activeClients += 1;
        activeClientsElement.textContent = activeClients;

        const clientList = document.getElementById('clientList');
        const newClient = document.createElement("li");
        newClient.innerHTML = `ФИО: ${clientName}, НОМЕР: +${clientCall} <button class="delete-btn" onclick="deleteClient(this)">Удалить</button>`;
        clientList.insertBefore(newClient, clientList.firstChild);

        document.getElementById("modal-client-name").value = "";
        closeModal('client');
    }
}

function deleteClient(button) {
    const li = button.parentElement;
    li.parentElement.removeChild(li);
    activeClients -= 1;
    activeClientsElement.textContent = activeClients;
}

function checkUserName() {
    const savedName = localStorage.getItem('userName');
    const savedStock = localStorage.getItem('stockCount');
    if (!savedName) {
        document.getElementById("nameModal").style.display = "block";
    } else {
        userNameElement.textContent = savedName;
        stockCount = parseInt(savedStock) || 0;
        updateStockDisplay();
        dashboard.style.display = "block";
    }
}

function saveUserName() {
    const name = document.getElementById("inputUserName").value.trim();
    if (name) {
        localStorage.setItem('userName', name);
        userNameElement.textContent = name;
        document.getElementById("nameModal").style.display = "none";
        dashboard.style.display = "block";
    }
}

function openEditNameModal() {
    const currentName = localStorage.getItem('userName') || '';
    document.getElementById("editInputUserName").value = currentName;
    document.getElementById("editNameModal").style.display = "block";
}

function saveEditedName() {
    const newName = document.getElementById("editInputUserName").value.trim();
    if (newName) {
        localStorage.setItem('userName', newName);
        userNameElement.textContent = newName;
        document.getElementById("editNameModal").style.display = "none";
    }
}

function openManageStockModal() {
    const currentStock = localStorage.getItem('stockCount') || 0;
    document.getElementById("manageStockInput").value = currentStock;
    document.getElementById("manageStockModal").style.display = "block";
}

function saveStockChanges() {
    const newStock = parseInt(document.getElementById("manageStockInput").value) || 0;
    localStorage.setItem('stockCount', newStock);
    stockCount = newStock; // Обновляем глобальную переменную
    updateStockDisplay();
    document.getElementById("manageStockModal").style.display = "none";
}

function updateStockDisplay() {
    stockCountElement.textContent = `${stockCount} шт.`;
}