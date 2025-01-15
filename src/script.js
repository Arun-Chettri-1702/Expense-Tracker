document.addEventListener("DOMContentLoaded", () => {
  const expenseName = document.getElementById("expense-name");
  const expenseAmount = document.getElementById("expense-amount");
  const submitBtn = document.getElementById("submit");
  const expenseForm = document.getElementById("expense-form");
  const expenseList = document.getElementById("expense-list");
  const totalAmountDisplay = document.getElementById("total-amount");

  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  renderExpense();
  updateTotal();

  expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const Name = expenseName.value.trim();
    const Amount = parseFloat(expenseAmount.value.trim());
    if (Name !== "" && !isNaN(Amount) && Amount > 0) {
      const expenseDetails = {
        id: Date.now(),
        name: Name,
        amount: Amount,
      };
      expenses.push(expenseDetails);
      saveExpenseToLocal();
      updateTotal();
      // clear input

      renderExpense();
    }
    expenseName.value = "";
    expenseAmount.value = "";
  });

  function calculateTotal() {
    return expenses.reduce(
      (accumulator, expense) => accumulator + expense.amount,
      0
    );
  }
  function updateTotal() {
    let totalAmount = calculateTotal();
    totalAmountDisplay.textContent = totalAmount.toFixed(2);
  }

  function renderExpense() {
    expenseList.innerHTML = "";

    if (expenses.length === 0) {
      return;
    } else {
      expenses.forEach((expense) => {
        let expenseLi = document.createElement("li");
        expenseLi.innerHTML = `<span>${expense.name}-$${expense.amount}</span><button data-id="${expense.id}">Remove</button>`;
        expenseLi.classList.add("expense");
        expenseList.appendChild(expenseLi);
      });
    }
  }

  expenseList.addEventListener("click", (e) => {
    e.stopPropagation();
    if (e.target.tagName !== "BUTTON") return;
    const removeId = parseInt(e.target.getAttribute("data-id"));
    deleteExpense(removeId);
  });

  function deleteExpense(removeId) {
    const index = expenses.findIndex((expense) => expense.id === removeId);
    if (index != -1) {
      expenses.splice(index, 1);
      saveExpenseToLocal();
      renderExpense();
      updateTotal();
    }
  }

  function saveExpenseToLocal() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }
});
