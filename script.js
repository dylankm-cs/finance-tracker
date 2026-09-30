console.log("Finance Tracker is running!");

const incomeDisplay = document.getElementById("income-amount");
const expenseDisplay = document.getElementById("expense-amount");
const balanceDisplay = document.getElementById("balance-amount");
const overallBudgetContainer = document.getElementById("overall-budget");

const transactionsContainer = document.getElementById("transactions-container");

let editingTransactionid = null;
let editingBudgetid = null;

const transaction = {
    id: 1,
    description: "Groceries",
    amount: 350,
    type: "expense",
    category: "Food",
    date: "2026-09-27"
};

const transaction2 = {
    id: 2,
    description: "Salary",
    amount: 20000,
    type: "income",
    category: "Salary",
    date: "2026-09-27"
};

function loadTransactions(){

    const savedTransactions = localStorage.getItem("transactions");

    if(savedTransactions === null){

        return [transaction, transaction2];

    }

    return JSON.parse(savedTransactions);

}

let transactions = loadTransactions();

function saveTransactions(){

    localStorage.setItem("transactions", JSON.stringify(transactions));

}

function calculateBudgetSpending(category){

    let totalSpent = 0;

    for(const transaction of transactions){

        if(transaction.type === "expense" && transaction.category === category){

            totalSpent = totalSpent + transaction.amount;

        }

    }

    return totalSpent;

}
function calculateOverallBudget(){

    let totalBudget = 0;

    for(const budget of budgets){

        totalBudget = totalBudget + budget.limit;

    }

    return totalBudget;

}
function calculateOverallSpending(){

    let totalSpent = 0;

    for(const budget of budgets){

        totalSpent = totalSpent + calculateBudgetSpending(budget.category);

    }

    return totalSpent;

}
function displayOverallBudget(){

    const totalBudget = calculateOverallBudget();

    const totalSpent = calculateOverallSpending();

    if(totalBudget === 0){

        overallBudgetContainer.innerHTML = `
        
            <div class="overall-budget">

                <h2>Overall Budget</h2>

                <p>No budgets have been created yet.</p>

            </div>
        
        `;

        return;

    }

    const actualPercentage = (totalSpent / totalBudget) * 100;

    const barPercentage = Math.min(actualPercentage, 100);

    const remaining = totalBudget - totalSpent;
    let budgetStatus = "";

if(remaining >= 0){

    budgetStatus = `Remaining: R${remaining.toFixed(2)}`;

}else{

    budgetStatus = `Over budget by: R${Math.abs(remaining).toFixed(2)}`;

}
overallBudgetContainer.innerHTML = `
    
    <div class="overall-budget">

        <h2>Overall Budget</h2>

       <div class="overall-budget-amount">
    R${totalSpent.toFixed(2)}
    <span>/ R${totalBudget.toFixed(2)}</span>
</div>

<div class="overall-budget-percentage">
    ${actualPercentage.toFixed(0)}% USED
</div>

<p class="budget-status">${budgetStatus}</p>

        <div class="budget-progress">

            <div class="budget-progress-fill"></div>

        </div>

    </div>

`;
const progressFill = overallBudgetContainer.querySelector(".budget-progress-fill");

progressFill.style.width = barPercentage + "%";

}
function displayBudget(){

    const budgetContainer = document.getElementById("budget-container");

    budgetContainer.innerHTML = "";

    for(const budget of budgets){

        const budgetElement = document.createElement("div");

        budgetElement.classList.add("budget");

        const totalSpent = calculateBudgetSpending(budget.category);

        const actualPercentage = (totalSpent / budget.limit) * 100;

        const barPercentage = Math.min(actualPercentage, 100);

        const remaining = budget.limit - totalSpent;
        let budgetStatus = "";
let budgetStatusClass = "";

if(remaining >= 0){

    budgetStatus = `Remaining: R${remaining.toFixed(2)}`;
    budgetStatusClass = "budget-status";

}else{

    budgetStatus = `Over budget by: R${Math.abs(remaining).toFixed(2)}`;
    budgetStatusClass = "budget-status over-budget-text";

}

        if(actualPercentage >= 100){

            budgetElement.classList.add("over-budget");

        }else if(actualPercentage >= 75){

            budgetElement.classList.add("budget-warning");

        }

        budgetElement.innerHTML = `
        
            <h3>${budget.category}</h3>

            <p>Spent: R${totalSpent.toFixed(2)}</p>

            <p>Budget: R${budget.limit.toFixed(2)} - ${actualPercentage.toFixed(0)}% used</p>
           <p class="${budgetStatusClass}">${budgetStatus}</p>

            <div class="budget-progress">

                <div class="budget-progress-fill"></div>

            </div>

            <div class="budget-actions">

                <button class="edit-budget">Edit</button>

                <button class="delete-budget">Delete</button>

            </div>
        `;

        const editBudgetButton = budgetElement.querySelector(".edit-budget");

        editBudgetButton.addEventListener("click", function(){

            editingBudgetid = budget.id;

            budgetCategoryInput.value = budget.category;

            budgetLimitInput.value = budget.limit;

            budgetButtonText.textContent = "Save Changes";

        });

        const deleteBudgetButton = budgetElement.querySelector(".delete-budget");

        deleteBudgetButton.addEventListener("click", function(){

            const index = budgets.findIndex(function(item){

                return item.id === budget.id;

            });

            budgets.splice(index, 1);

            saveBudgets();

            displayBudget();
            displayOverallBudget();

        });

        const progressFill = budgetElement.querySelector(".budget-progress-fill");

        progressFill.style.width = barPercentage + "%";

        budgetContainer.appendChild(budgetElement);

    }

}

function updateDashboard(){

    let totalIncome = 0;

    let totalExpenses = 0;

    for(const transaction of transactions){

        if(transaction.type === "income"){

            totalIncome = totalIncome + transaction.amount;

        }else{

            totalExpenses = totalExpenses + transaction.amount;

        }

    }

    const balance = totalIncome - totalExpenses;

    incomeDisplay.textContent = "R" + totalIncome.toFixed(2);

    expenseDisplay.textContent = "R" + totalExpenses.toFixed(2);

    balanceDisplay.textContent = "R" + balance.toFixed(2);

}

const defaultBudgets = [

    {
        id: 1,
        category: "Food",
        limit: 3000
    },

    {
        id: 2,
        category: "Transport",
        limit: 1500
    },

    {
        id: 3,
        category: "Entertainment",
        limit: 1000
    }

];

function loadBudget(){

    const savedBudgets = localStorage.getItem("budgets");

    if(savedBudgets === null){

        return defaultBudgets;

    }

    return JSON.parse(savedBudgets);

}

function saveBudgets(){

    localStorage.setItem("budgets", JSON.stringify(budgets));

}

let budgets = loadBudget();

const descriptionInput = document.getElementById("description");

const amountInput = document.getElementById("amount");

const typeInput = document.getElementById("type");

const categoryInput = document.getElementById("category");

const dateInput = document.getElementById("date");

dateInput.value = new Date().toISOString().split("T")[0];

const searchInput = document.getElementById("search-input");

const typeFilter = document.getElementById("type-filter");

const categoryFilter = document.getElementById("category-filter");

const sortFilter = document.getElementById("sort-filter");

const descriptionError = document.getElementById("description-error");

const amountError = document.getElementById("amount-error");

const categoryError = document.getElementById("category-error");

const transactionButtonText = document.getElementById("transaction-button-text");

const addTransactionButton = document.getElementById("add-transaction");

const budgetCategoryInput = document.getElementById("budget-category");

const budgetLimitInput = document.getElementById("budget-limit");

const budgetError = document.getElementById("budget-error");

const budgetButtonText = document.getElementById("budget-button-text");

const addBudgetButton = document.getElementById("add-budget");

addBudgetButton.addEventListener("click", function(){

    budgetError.textContent = "";

    const category = budgetCategoryInput.value.trim();

    const limit = Number(budgetLimitInput.value);

    if(category === ""){

        budgetError.textContent = "Category is required.";

        return;

    }

    if(limit <= 0){

        budgetError.textContent = "Budget limit must be greater than R0.";

        return;

    }

    const existingBudget = budgets.find(function(budget){

        return (
            budget.category.toLowerCase() === category.toLowerCase()
            && budget.id !== editingBudgetid
        );

    });

    if(existingBudget){

        budgetError.textContent = "A budget for this category already exists.";

        return;

    }

    if(editingBudgetid !== null){

        const budgetToEdit = budgets.find(function(budget){

            return budget.id === editingBudgetid;

        });

        budgetToEdit.category = category;

        budgetToEdit.limit = limit;

        editingBudgetid = null;

        saveBudgets();

        displayBudget();
        displayOverallBudget();

        budgetCategoryInput.value = "";

        budgetLimitInput.value = "";

        budgetButtonText.textContent = "Add Budget";

        return;

    }

    const newBudget = {

        id: Date.now(),

        category: category,

        limit: limit

    };

    budgets.push(newBudget);

    saveBudgets();

    displayBudget();
    displayOverallBudget();

    budgetCategoryInput.value = "";

    budgetLimitInput.value = "";

});

function updateCategoryFilter(){

    const selectedCategory = categoryFilter.value;

    categoryFilter.innerHTML = "";

    const allOption = document.createElement("option");

    allOption.value = "all";

    allOption.textContent = "All Categories";

    categoryFilter.appendChild(allOption);

    const categories = transactions.map(function(transaction){

        return transaction.category;

    });

    const uniqueCategories = [...new Set(categories)];

    for(const category of uniqueCategories){

        const option = document.createElement("option");

        option.value = category;

        option.textContent = category;

        categoryFilter.appendChild(option);

    }

    if(uniqueCategories.includes(selectedCategory)){

        categoryFilter.value = selectedCategory;

    }

}

function displayTransactions(){

    transactionsContainer.innerHTML = "";

    const searchTerm = searchInput.value.toLowerCase();

    const selectedType = typeFilter.value;

    const selectedCategory = categoryFilter.value;

    const selectSort = sortFilter.value;

    const filteredTransactions = transactions.filter(function(transaction){

        return (

            (

                transaction.description.toLowerCase().includes(searchTerm) ||

                transaction.category.toLowerCase().includes(searchTerm)

            )

            &&

            (

                selectedType === "all" ||

                transaction.type === selectedType

            )

            &&

            (

                selectedCategory === "all" ||

                transaction.category === selectedCategory

            )

        );

    });

    filteredTransactions.sort(function(a, b){

        if(selectSort === "highest"){

            return b.amount - a.amount;

        }

        if(selectSort === "lowest"){

            return a.amount - b.amount;

        }

        if(selectSort === "newest"){

            return new Date(b.date) - new Date(a.date);

        }

        if(selectSort === "oldest"){

            return new Date(a.date) - new Date(b.date);

        }

    });

    for(const transaction of filteredTransactions){

        const transactionElement = document.createElement("div");

        transactionElement.classList.add("transaction");

        if(transaction.type === "income"){

            transactionElement.classList.add("income");

        }else{

            transactionElement.classList.add("expense");

        }

        transactionElement.innerHTML = `
            <div class="transaction-info">

                <h3>${transaction.description}</h3>

                <p>${transaction.category} • ${transaction.date}</p>

            </div>

            <div class="transaction-right">

                <p class="transaction-amount">R${transaction.amount.toFixed(2)}</p>

                <div class="transaction-actions">

                    <button class="edit-transaction">Edit</button>

                    <button class="delete-transaction">Delete</button>

                </div>

            </div>
        `;

        const editButton = transactionElement.querySelector(".edit-transaction");

        editButton.addEventListener("click", function(){

            editingTransactionid = transaction.id;

            descriptionInput.value = transaction.description;

            amountInput.value = transaction.amount;

            typeInput.value = transaction.type;

            categoryInput.value = transaction.category;

            dateInput.value = transaction.date;

            transactionButtonText.textContent = "Save Changes";

        });

        const deleteButton = transactionElement.querySelector(".delete-transaction");

        deleteButton.addEventListener("click", function(){

            const index = transactions.findIndex(function(item){

                return item.id === transaction.id;

            });

            transactions.splice(index, 1);

            saveTransactions();

            updateDashboard();

            updateCategoryFilter();

            displayTransactions();

            displayBudget();
            displayOverallBudget();

        });

        transactionsContainer.appendChild(transactionElement);

    }

}

searchInput.addEventListener("input", function(){

    displayTransactions();

});

typeFilter.addEventListener("change", function(){

    displayTransactions();

});

categoryFilter.addEventListener("change", function(){

    displayTransactions();

});

sortFilter.addEventListener("change", function(){

    displayTransactions();

});

addTransactionButton.addEventListener("click", function(){

    let hasError = false;

    descriptionInput.classList.remove("input-error");

    amountInput.classList.remove("input-error");

    categoryInput.classList.remove("input-error");

    descriptionError.textContent = "";

    amountError.textContent = "";

    categoryError.textContent = "";

    if(descriptionInput.value.trim() === ""){

        descriptionInput.classList.add("input-error");

        descriptionError.textContent = "Description is required";

        hasError = true;

    }

    if(amountInput.value === ""){

        amountInput.classList.add("input-error");

        amountError.textContent = "Amount is required";

        hasError = true;

    }else if(Number(amountInput.value) <= 0){

        amountInput.classList.add("input-error");

        amountError.textContent = "Amount must be greater than R0";

        hasError = true;

    }

    if(categoryInput.value.trim() === ""){

        categoryInput.classList.add("input-error");

        categoryError.textContent = "Category is required.";

        hasError = true;

    }

    if(hasError){

        return;

    }

    if(editingTransactionid === null){

        const newTransaction = {

            id: Date.now(),

            description: descriptionInput.value,

            amount: Number(amountInput.value),

            type: typeInput.value,

            category: categoryInput.value,

            date: dateInput.value

        };

        transactions.push(newTransaction);

        saveTransactions();

    }else{

        const transactionToEdit = transactions.find(function(item){

            return item.id === editingTransactionid;

        });

        transactionToEdit.description = descriptionInput.value;

        transactionToEdit.amount = Number(amountInput.value);

        transactionToEdit.type = typeInput.value;

        transactionToEdit.category = categoryInput.value;

        transactionToEdit.date = dateInput.value;

        saveTransactions();

    }

    updateDashboard();

    updateCategoryFilter();

    displayTransactions();

    displayBudget();
    displayOverallBudget();

    editingTransactionid = null;

    descriptionInput.value = "";

    amountInput.value = "";

    categoryInput.value = "";

    typeInput.value = "expense";

    dateInput.value = new Date().toISOString().split("T")[0];

    transactionButtonText.textContent = "Add transaction";

});

updateDashboard();

updateCategoryFilter();

displayTransactions();

displayBudget();

displayOverallBudget();