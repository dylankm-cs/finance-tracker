console.log("Finance Tracker is running!");
const incomeDisplay = document.getElementById("income-amount");
const expenseDisplay = document.getElementById("expense-amount");
const balanceDisplay = document.getElementById("balance-amount");
const transactionsContainer = document.getElementById("transactions-container");
let editingTransactionid = null;


const transaction ={
    id: 1,
    description: "Groceries",
    amount:350,
    type:"expense",
    category: "Food",
    date: "2026-09-27"

};
const transaction2 ={
    id: 2,
    description: "Salary",
    amount: 20000,
    type: "income",
    category: "Salary",
    date: "2026-09-27"
};

function loadTransactions(){

    const savedTransactions = localStorage.getItem("transactions");

    if (savedTransactions === null){
        return[transaction, transaction2];
    }
    return JSON.parse(savedTransactions);
}
let transactions = loadTransactions();
function saveTransactions(){
    localStorage.setItem("transactions", JSON.stringify(transactions));
}
console.log(transactions);

function updateDashboard(){
    let totalIncome =0;
    let totalExpenses =0;

    for(const transaction of transactions){
        if(transaction.type==="income"){
            totalIncome = totalIncome + transaction.amount;
        } else{
            totalExpenses = totalExpenses + transaction.amount;
        }
    }
    const balance = totalIncome - totalExpenses;

    incomeDisplay.textContent = "R" + totalIncome + ".00";
    expenseDisplay.textContent = "R" + totalExpenses + ".00";
    balanceDisplay.textContent = "R" + balance + ".00";
}
let budget =[
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
const categoryError = document.getElementById("category-error")
const transactionButtonText = document.getElementById("transaction-button-text");
const addTransactionButton = document.getElementById("add-transaction");

function updateCategoryFilter(){
    const selectedCategory = categoryFilter.value;
    categoryFilter.innerHTML="";

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
    transactionsContainer.innerHTML="";

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
                selectedCategory === "all" || transaction.category === selectedCategory
            )
        );
    });

    filteredTransactions.sort(function(a,b){
        if(selectSort === "highest"){
            return b.amount - a.amount;
        }
        if(selectSort === "lowest"){
            return a.amount - b.amount;
        }
        if(selectSort === "newest"){
            return new Date(b.date)- new Date(a.date);
        }
        if(selectSort === "oldest"){
            return new Date(a.date)- new Date(b.date);
        }
    });

    for(const transaction of filteredTransactions){
        const transactionElement = document.createElement("div");
        transactionElement.classList.add("transaction");

        if(transaction.type ==="income"){
            transactionElement.classList.add("income");
        }else{
            transactionElement.classList.add("expense");
        }

        transactionElement.innerHTML = `
           <div class = "transaction-info">
           <h3>${transaction.description}</h3>
           <p>${transaction.category}• ${transaction.date}</p>
           </div>

           <div class="transaction-right">
           <p class = "transaction-amount">R${transaction.amount.toFixed(2)}</p>

           <div class = "transaction-actions"> 
            <button class="edit-transaction">Edit</button>
            <button class ="delete-transaction"> Delete</button>
            </div>
            </div>
        `;

        const editButton = transactionElement.querySelector(".edit-transaction");
        editButton.addEventListener("click",function(){
            editingTransactionid = transaction.id;

            descriptionInput.value = transaction.description;
            amountInput.value = transaction.amount;
            typeInput.value = transaction.type;
            categoryInput.value = transaction.category;
            dateInput.value = transaction.date;
            transactionButtonText.textContent = "Save Changes";
        });

        const deleteButton = transactionElement.querySelector(".delete-transaction");
        deleteButton.addEventListener("click",function(){
            const index =transactions.findIndex(function(item){
                return item.id === transaction.id;
            });

            transactions.splice(index,1);
            saveTransactions();

            updateDashboard();
            updateCategoryFilter();
            displayTransactions();
        });

        transactionsContainer.appendChild(transactionElement);
    }
}

searchInput.addEventListener("input", function(){
    displayTransactions();
});

typeFilter.addEventListener("change",function(){
    displayTransactions();
});

categoryFilter.addEventListener("change",function(){
    displayTransactions();
});

sortFilter.addEventListener("change", function(){
    displayTransactions();
});

console.log(addTransactionButton);

addTransactionButton.addEventListener("click", function() {

    let hasError = false;

    descriptionInput.classList.remove("input-error");
    amountInput.classList.remove("input-error");
    categoryInput.classList.remove("input-error");

    descriptionError.textContent = "";
    amountError.textContent="";
    categoryError.textContent="";

    if(descriptionInput.value.trim() ===""){
        descriptionInput.classList.add("input-error");
        descriptionError.textContent="Description is required";
        hasError = true;
    }

    if (amountInput.value === ""){
        amountInput.classList.add("input-error");
        amountError.textContent="Amount is required";
        hasError = true;
    }else if(Number(amountInput.value)<=0){
        amountInput.classList.add("input-error");
        amountError.textContent="Amount must be greater than R0";
        hasError = true;
    }

    if (categoryInput.value.trim() === "") {
        categoryInput.classList.add("input-error");
        categoryError.textContent = "Category is required.";
        hasError = true;
    }

    if(hasError){
        return;
    }

    if (editingTransactionid === null) {

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

    } else {

        const transactionToEdit = transactions.find(function(item) {
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

    editingTransactionid=null;

    descriptionInput.value="";
    amountInput.value="";
    categoryInput.value="";
    typeInput.value="expense";
    dateInput.value = new Date().toISOString().split("T")[0];

    transactionButtonText.textContent="Add transaction";
});

updateDashboard();
updateCategoryFilter();
displayTransactions();