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
let stockCount = 0;

const formattedDate = today.toLocaleDateString('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
});

dateElement.textContent = formattedDate;
updateStockDisplay();

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
    const date = document.getElementById("modal-sale-date").value.trim();
    const product = document.getElementById("modal-sale-product").value.trim();
    const priceText = document.getElementById("modal-sale-price").value.trim();
    const client = document.getElementById("modal-sale-client").value.trim();

    if (!date || !product || !priceText || !client) {
        alert("Все поля должны быть заполнены!");
        return;
    }

    let price = parseFloat(priceText);
    if (isNaN(price) || price <= 0) {
        alert("Введите корректную цену больше 0!");
        return;
    }

    if (stockCount > 0) {
        totalSalesIncome += price;
        salesIncomeElement.textContent = `${totalSalesIncome.toFixed(2)} ₽`;
        stockCount -= 1;
        updateStockDisplay();

        const newSale = document.createElement("li");
        newSale.innerHTML = `ДАТА: ${date}, ТОВАР: ${product}, ЦЕНА: ${priceText} ₽, КЛИЕНТ: ${client} <button class="delete-btn" onclick="deleteSale(this)">Удалить</button>`;
        salesList.insertBefore(newSale, salesList.firstChild);
        newSale.style.opacity = '0'; // Начинаем с невидимости для анимации
        setTimeout(() => newSale.style.opacity = '1', 10); // Плавное появление

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
    const price = parseFloat(priceText);
    totalSalesIncome -= price;
    salesIncomeElement.textContent = `${totalSalesIncome.toFixed(2)} ₽`;
    stockCount += 1;
    updateStockDisplay();
    li.parentElement.removeChild(li);
}

function addExpenseForm() {
    const date = document.getElementById("modal-expense-date").value.trim();
    const item = document.getElementById("modal-expense-item").value.trim();
    const priceText = document.getElementById("modal-expense-price").value.trim();

    document.getElementById("modal-extra-expense-date").value = date;
    document.getElementById("modal-extra-expense-item").value = item;
    document.getElementById("modal-extra-expense-price").value = priceText;

    document.getElementById("expenseModal").style.display = "none";
    document.getElementById("extraExpenseModal").style.display = "block";
}

function saveExpense() {
    const date = document.getElementById("modal-extra-expense-date").value.trim();
    const item = document.getElementById("modal-extra-expense-item").value.trim();
    const priceText = document.getElementById("modal-extra-expense-price").value.trim();

    if (!date || !item || !priceText) {
        alert("Все поля должны быть заполнены!");
        return;
    }

    let price = parseFloat(priceText);
    if (isNaN(price) || price <= 0) {
        alert("Введите корректную цену больше 0!");
        return;
    }

    totalExpenses += price;
    expenseTotalElement.textContent = `${totalExpenses.toFixed(2)} ₽`;

    const newExpense = document.createElement("li");
    newExpense.innerHTML = `ДАТА: ${date}, ПОКУПКА: ${item}, ЦЕНА: ${priceText} ₽ <button class="delete-btn" onclick="deleteExpense(this)">Удалить</button>`;
    expenseList.insertBefore(newExpense, expenseList.firstChild);
    newExpense.style.opacity = '0'; // Начинаем с невидимости
    setTimeout(() => newExpense.style.opacity = '1', 10); // Плавное появление

    document.getElementById("modal-extra-expense-date").value = formattedDate;
    document.getElementById("modal-extra-expense-item").value = "";
    document.getElementById("modal-extra-expense-price").value = "";

    closeModal('extra');
}

function deleteExpense(button) {
    const li = button.parentElement;
    const priceText = li.textContent.match(/ЦЕНА: (\d+(?:\.\d+)?)/)[1];
    const price = parseFloat(priceText);
    totalExpenses -= price;
    expenseTotalElement.textContent = `${totalExpenses.toFixed(2)} ₽`;
    li.parentElement.removeChild(li);
}

function saveClient() {
    const clientName = document.getElementById("modal-client-name").value.trim();
    const clientCall = document.getElementById("modal-client-numcall").value.trim();

    if (!clientName || !clientCall) {
        alert("Все поля должны быть заполнены!");
        return;
    }

    activeClients += 1;
    activeClientsElement.textContent = activeClients;

    const newClient = document.createElement("li");
    newClient.innerHTML = `ФИО: ${clientName}, НОМЕР: +${clientCall} <button class="delete-btn" onclick="deleteClient(this)">Удалить</button>`;
    clientList.insertBefore(newClient, clientList.firstChild);
    newClient.style.opacity = '0'; // Начинаем с невидимости
    setTimeout(() => newClient.style.opacity = '1', 10); // Плавное появление

    document.getElementById("modal-client-name").value = "";
    closeModal('client');
}

function deleteClient(button) {
    const li = button.parentElement;
    li.parentElement.removeChild(li);
    activeClients -= 1;
    activeClientsElement.textContent = activeClients;
}

function checkUserName() {
    if (!document.getElementById("nameModal").style.display || document.getElementById("nameModal").style.display === "none") {
        document.getElementById("nameModal").style.display = "block";
    } else {
        const savedName = "";
        if (!savedName) {
            document.getElementById("nameModal").style.display = "block";
        } else {
            userNameElement.textContent = savedName;
            dashboard.style.display = "block";
        }
    }
}

function saveUserName() {
    const name = document.getElementById("inputUserName").value.trim();
    if (!name) {
        alert("Введите имя!");
        return;
    }
    userNameElement.textContent = name;
    document.getElementById("nameModal").style.display = "none";
    dashboard.style.display = "block";
}

function openEditNameModal() {
    const currentName = userNameElement.textContent || '';
    document.getElementById("editInputUserName").value = currentName;
    document.getElementById("editNameModal").style.display = "block";
}

function saveEditedName() {
    const newName = document.getElementById("editInputUserName").value.trim();
    if (!newName) {
        alert("Введите имя!");
        return;
    }
    userNameElement.textContent = newName;
    document.getElementById("editNameModal").style.display = "none";
}

function openManageStockModal() {
    const currentStock = stockCount || 0;
    document.getElementById("manageStockInput").value = currentStock;
    document.getElementById("manageStockModal").style.display = "block";
}

function saveStockChanges() {
    const newStock = parseInt(document.getElementById("manageStockInput").value) || 0;
    stockCount = newStock;
    updateStockDisplay();
    document.getElementById("manageStockModal").style.display = "none";
}

function updateStockDisplay() {
    stockCountElement.textContent = `${stockCount} шт.`;
}