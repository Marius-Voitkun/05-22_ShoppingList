// sessionStorage.setItem('data', JSON.stringify(
//     [
//       {
//         id: 1,
//         name: 'apple',
//         quantity: 2,
//         units: 'kg',
//         category: 'fruit'
//       },
//       {
//         id: 2,
//         name: 'milk',
//         quantity: 1,
//         units: 'l',
//         category: 'dairy'
//       },
//       {
//         id: 3,
//         name: 'tea',
//         quantity: 1,
//         units: 'pack',
//         category: 'drinks'
//       },
//     ])
// );

let items = JSON.parse(sessionStorage.getItem("data"));
if (items === null) {
  items = [];
  sessionStorage.setItem("id", 0);
}
else sessionStorage.setItem("id", items[items.length - 1].id);

updateTable(items);

document.getElementById('name').focus();
document.getElementById('add-btn').addEventListener('click', addNewItem);


function updateTable(itemsList) {
  let generatedHtml = '';
  
  for (let i = 0; i < itemsList.length; i++) {
    const item = itemsList[i];
    
    let tableRow = `<tr>
                      <td>${item.name}</td>
                      <td>${item.quantity}</td>
                      <td>${item.units}</td>
                      <td>${item.category}</td>
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

  let id = parseInt(sessionStorage.getItem("id")) + 1;
  sessionStorage.setItem("id", id);

  let item = {
    id: id,
    name: document.getElementById('name').value,
    quantity: document.getElementById('quantity').value,
    units: document.getElementById('units').value,
    category: document.getElementById('category').value,
  };

  items.push(item);
  sessionStorage.setItem('data', JSON.stringify(items));

  clearForm();
  updateTable(items);

  document.getElementById('name').focus();
}


function clearForm() {
  let fields = document.getElementsByClassName('form-control');
  
  for (let field of fields) {
    field.value = '';
  }
}


function inputValidation(edit) {
  let fields = document.getElementsByClassName('form-control');
  let isFormEmpty = true;

  for (let field of fields)
    if (field.value != '') isFormEmpty = false;
  
  if (isFormEmpty) {
    document.getElementById('validation').innerHTML = `<p class="error">Please fill the form</p>`;
    return false;
  }
  if (fields[0].value == '') {
    document.getElementById('validation').innerHTML = `<p class="error">Please enter the item name</p>`;
    return false;
  }
  
  if (edit) {
    document.getElementById('validation').innerHTML = `<p class="success">Changes saved</p>`;
    return true;
  }
  document.getElementById('validation').innerHTML = `<p class="success">Item successfully added</p>`;
  return true;
}


function activateBtnsInTable() {
  let editBtns = document.getElementsByClassName('edit');
  let deleteBtns = document.getElementsByClassName('delete');

  for (let btn of editBtns) {
    btn.addEventListener('click', function() {
      editEntry(btn.id);
    });
  }

  for (let btn of deleteBtns) {
    btn.addEventListener('click', function() {
      deleteEntry(btn.id);
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

  updateTable(items);
  sessionStorage.setItem('data', JSON.stringify(items));
  clearForm();

  document.getElementById('add-btn').style = '';
  document.getElementById('save-changes-btn').style = 'display: none;';
  document.getElementById('name').focus();
}


function deleteEntry(deleteId) {
  for (let i = 0; i < items.length; i++) {
    if (`delete-${items[i].id}` == deleteId)
      items.splice(i, 1);
  }

  updateTable(items);
  sessionStorage.setItem('data', JSON.stringify(items));
  
  clearForm();
  document.getElementById('add-btn').style = '';
  document.getElementById('save-changes-btn').style = 'display:none;';
  document.getElementById('name').focus();
}