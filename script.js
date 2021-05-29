// localStorage.setItem('data', JSON.stringify(
//     [
//       {
//         id: 1,
//         name: 'apple',
//         quantity: 2,
//         units: 'kg',
//         category: 'fruit',
//         status: 0
//       },
//       {
//         id: 2,
//         name: 'milk',
//         quantity: 1,
//         units: 'l',
//         category: 'dairy',
//         status: 0
//       },
//       {
//         id: 3,
//         name: 'tea',
//         quantity: 1,
//         units: 'pack',
//         category: 'drinks',
//         status: 0
//       },
//     ])
// );

let items = JSON.parse(localStorage.getItem('data'));
let select = document.getElementById('select-category');

if (items === null) {
  items = [];
  localStorage.setItem('id', 0);
}
else localStorage.setItem('id', items[items.length - 1].id);

updateTable(items);
updateFilter();
select.addEventListener('change', function() {
  console.log(select.value);
  updateTable(items);
});


document.getElementById('add-btn').addEventListener('click', addNewItem);
document.getElementById('cancel-btn').addEventListener('click', function() {
  clearForm();
  document.getElementById('validation').innerHTML = ``;
  document.getElementById('add-btn').style = '';
  document.getElementById('save-changes-btn').style = 'display: none;';
});

document.getElementById('hide-form-btn').addEventListener('click', function() {
  document.getElementById('enter-data').classList.add('hidden');
  document.getElementById('show-form-btn').classList.remove('hidden');
  document.getElementById('show-form-btn').classList.add('block');
})
document.getElementById('show-form-btn').addEventListener('click', function() {
  document.getElementById('enter-data').classList.remove('hidden');
  document.getElementById('show-form-btn').classList.remove('block');
  document.getElementById('show-form-btn').classList.add('hidden');
  document.getElementById('validation').innerHTML = ``;
})


function updateTable(itemsList) {
  let select = document.getElementById('select-category');
  let generatedHtml = '';
  
  for (let i = 0; i < itemsList.length; i++) {
    const item = itemsList[i];
    if (select.value != 0 && select.value != item.category) continue;
    
    let status = '';
    if (item.status == 1)
      status = 'checked';

    let tableRow = `<tr>
                      <td><input type="checkbox" class="is-bought" id="bought-${item.id}" ${status}></td>
                      <td class="${status}">${item.name}</td>
                      <td class="${status}">${item.quantity}</td>
                      <td class="${status}">${item.units}</td>
                      <td class="${status}">${item.category}</td>
                      <td>
                        <div class="edit btn btn-warning" id="edit-${item.id}">edit</div>
                        <div class="delete btn btn-danger" id="delete-${item.id}">delete</div>
                      </td>
                    </tr>`;
    
    generatedHtml += tableRow;
  }
  
  document.getElementsByClassName('table')[0].getElementsByTagName('tbody')[0].innerHTML = generatedHtml;

  activateBtnsInTable();
}


function addNewItem() {
  if (!inputValidation()) return;

  let id = parseInt(localStorage.getItem("id")) + 1;
  localStorage.setItem("id", id);

  let item = {
    id: id,
    name: document.getElementById('name').value,
    quantity: document.getElementById('quantity').value,
    units: document.getElementById('units').value,
    category: document.getElementById('category').value,
    status: 0
  };

  items.push(item);
  localStorage.setItem('data', JSON.stringify(items));
  updateTable(items);
  updateFilter();
  clearForm();
}


function clearForm() {
  let fields = document.getElementsByClassName('form-control');
  
  for (let field of fields) {
    field.value = '';
  }
  
  document.getElementById('name').focus();
}


function inputValidation(edit) {
  let fields = document.getElementsByClassName('form-control');
  let isFormEmpty = true;
  document.getElementById('name').focus();

  for (let field of fields)
    if (field.value != '') isFormEmpty = false;
  
  if (isFormEmpty) {
    document.getElementById('validation').innerHTML = `<p class="error">Please fill the form.</p>`;
    return false;
  }
  if (fields[0].value == '') {
    document.getElementById('validation').innerHTML = `<p class="error">Please enter the item name.</p>`;
    return false;
  }
  
  if (edit) {
    document.getElementById('validation').innerHTML = `<p class="success">Changes saved.</p>`;
    return true;
  }
  document.getElementById('validation').innerHTML = `<p class="success">Item successfully added.</p>`;
  return true;
}


function activateBtnsInTable() {
  let checkboxes = document.getElementsByClassName('is-bought');
  let editBtns = document.getElementsByClassName('edit');
  let deleteBtns = document.getElementsByClassName('delete');

  for (let checkbox of checkboxes) {
    checkbox.addEventListener('change', isBought);
  }

  for (let btn of editBtns) {
    btn.addEventListener('click', function() {
      editEntry(btn.id);
      document.getElementById('validation').innerHTML = ``;
    });
  }
  
  for (let btn of deleteBtns) {
    btn.addEventListener('click', function() {
      deleteEntry(btn.id);
      document.getElementById('validation').innerHTML = ``;
    });
  }
}


function editEntry(editId) {
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    if( `edit-${item.id}` == editId) {
      enterEditMode(i);  
    }
  }
  document.getElementById('save-changes-btn').addEventListener('click', saveChanges);
}


function enterEditMode(index) {
  for (let key in items[index]) {
    document.getElementById(key).value = items[index][key];
  }

  document.getElementById('add-btn').style = 'display: none';
  document.getElementById('save-changes-btn').style = '';
}


function saveChanges() {
  if (!inputValidation(true)) return;

  let itemId = document.getElementById('id').value;

  let item = items.filter(item => item.id == itemId)[0];

  for (let key in item) {
    item[key] = document.getElementById(key).value;
  }
  item.id = parseInt(item.id);

  localStorage.setItem('data', JSON.stringify(items));
  updateTable(items);
  updateFilter();
  clearForm();
  document.getElementById('add-btn').style = '';
  document.getElementById('save-changes-btn').style = 'display: none;';
}


function deleteEntry(deleteId) {
  for (let i = 0; i < items.length; i++) {
    if (`delete-${items[i].id}` == deleteId)
      items.splice(i, 1);
  }

  localStorage.setItem('data', JSON.stringify(items));
  updateTable(items);
  updateFilter();
  clearForm();
  document.getElementById('add-btn').style = '';
  document.getElementById('save-changes-btn').style = 'display:none;';
}


function updateFilter() {
  let shoppingList = JSON.parse(localStorage.getItem('data'));
  let categories = [];
  let html = `<option value="0">Show all categories</option>`;
  
  if (shoppingList == null) return;

  shoppingList.forEach(item => {
    if (!categories.includes(item.category)) 
      categories.push(item.category);
    });

  categories.forEach(category => {
    html += `<option value="${category}">${category}</option>`;
  });

  select.innerHTML = html;
}


function isBought() {
  let checkboxes = document.getElementsByClassName('is-bought');

  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked)
      items[i].status = 1;
    else
      items[i].status = 0;
  }
  localStorage.setItem('data', JSON.stringify(items));
  updateTable(items);
}