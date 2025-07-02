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
loadData(); // Загружаем данные при старте
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

    saveData();
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
    saveData();
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

    saveData();
    closeModal('extra');
}

function deleteExpense(button) {
    const li = button.parentElement;
    const priceText = li.textContent.match(/ЦЕНА: (\d+(?:\.\d+)?)/)[1];
    const price = parseFloat(priceText.replace('Р', '').replace(',', '.'));
    totalExpenses -= price;
    expenseTotalElement.textContent = `${totalExpenses.toFixed(2)} ₽`;
    li.parentElement.removeChild(li);
    saveData();
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
    saveData();
}

function deleteClient(button) {
    const li = button.parentElement;
    li.parentElement.removeChild(li);
    activeClients -= 1;
    activeClientsElement.textContent = activeClients;
    saveData();
}

function checkUserName() {
    const savedName = localStorage.getItem('userName');
    const savedStock = localStorage.getItem('stockCount');
    const savedSalesIncome = localStorage.getItem('totalSalesIncome');
    const savedExpenses = localStorage.getItem('totalExpenses');
    const savedActiveClients = localStorage.getItem('activeClients');
    const savedSales = JSON.parse(localStorage.getItem('salesList') || '[]');
    const savedExpensesList = JSON.parse(localStorage.getItem('expenseList') || '[]');
    const savedClients = JSON.parse(localStorage.getItem('clientList') || '[]');

    if (!savedName) {
        document.getElementById("nameModal").style.display = "block";
    } else {
        userNameElement.textContent = savedName;
        stockCount = parseInt(savedStock) || 0;
        totalSalesIncome = parseFloat(savedSalesIncome) || 0;
        totalExpenses = parseFloat(savedExpenses) || 0;
        activeClients = parseInt(savedActiveClients) || 0;

        salesIncomeElement.textContent = `${totalSalesIncome.toFixed(2)} ₽`;
        expenseTotalElement.textContent = `${totalExpenses.toFixed(2)} ₽`;
        activeClientsElement.textContent = activeClients;
        updateStockDisplay();

        // Восстановление списков
        salesList.innerHTML = '';
        savedSales.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `${item.text} <button class="delete-btn" onclick="deleteSale(this)">Удалить</button>`;
            salesList.appendChild(li);
        });

        expenseList.innerHTML = '';
        savedExpensesList.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `${item.text} <button class="delete-btn" onclick="deleteExpense(this)">Удалить</button>`;
            expenseList.appendChild(li);
        });

        clientList.innerHTML = '';
        savedClients.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `${item.text} <button class="delete-btn" onclick="deleteClient(this)">Удалить</button>`;
            clientList.appendChild(li);
        });

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
    saveData();
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
    saveData();
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
    saveData();
    document.getElementById("manageStockModal").style.display = "none";
}

function updateStockDisplay() {
    stockCountElement.textContent = `${stockCount} шт.`;
}

function saveData() {
    localStorage.setItem('userName', userNameElement.textContent);
    localStorage.setItem('stockCount', stockCount);
    localStorage.setItem('totalSalesIncome', totalSalesIncome);
    localStorage.setItem('totalExpenses', totalExpenses);
    localStorage.setItem('activeClients', activeClients);

    const salesData = Array.from(salesList.children).map(li => ({
        text: li.textContent.replace('Удалить', '').trim()
    }));
    const expenseData = Array.from(expenseList.children).map(li => ({
        text: li.textContent.replace('Удалить', '').trim()
    }));
    const clientData = Array.from(clientList.children).map(li => ({
        text: li.textContent.replace('Удалить', '').trim()
    }));

    localStorage.setItem('salesList', JSON.stringify(salesData));
    localStorage.setItem('expenseList', JSON.stringify(expenseData));
    localStorage.setItem('clientList', JSON.stringify(clientData));
}

function loadData() {
    const savedName = localStorage.getItem('userName');
    const savedStock = localStorage.getItem('stockCount');
    const savedSalesIncome = localStorage.getItem('totalSalesIncome');
    const savedExpenses = localStorage.getItem('totalExpenses');
    const savedActiveClients = localStorage.getItem('activeClients');
    const savedSales = JSON.parse(localStorage.getItem('salesList') || '[]');
    const savedExpensesList = JSON.parse(localStorage.getItem('expenseList') || '[]');
    const savedClients = JSON.parse(localStorage.getItem('clientList') || '[]');

    if (savedName) {
        userNameElement.textContent = savedName;
        stockCount = parseInt(savedStock) || 0;
        totalSalesIncome = parseFloat(savedSalesIncome) || 0;
        totalExpenses = parseFloat(savedExpenses) || 0;
        activeClients = parseInt(savedActiveClients) || 0;

        salesIncomeElement.textContent = `${totalSalesIncome.toFixed(2)} ₽`;
        expenseTotalElement.textContent = `${totalExpenses.toFixed(2)} ₽`;
        activeClientsElement.textContent = activeClients;
        updateStockDisplay();

        // Восстановление списков
        salesList.innerHTML = '';
        savedSales.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `${item.text} <button class="delete-btn" onclick="deleteSale(this)">Удалить</button>`;
            salesList.appendChild(li);
        });

        expenseList.innerHTML = '';
        savedExpensesList.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `${item.text} <button class="delete-btn" onclick="deleteExpense(this)">Удалить</button>`;
            expenseList.appendChild(li);
        });

        clientList.innerHTML = '';
        savedClients.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `${item.text} <button class="delete-btn" onclick="deleteClient(this)">Удалить</button>`;
            clientList.appendChild(li);
        });
    }
}