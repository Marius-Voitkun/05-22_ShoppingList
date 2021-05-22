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

document.getElementById('item-name').focus();
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
  let id = parseInt(sessionStorage.getItem("id")) + 1;
  sessionStorage.setItem("id", id);

  let item = {
    id: id,
    name: document.getElementById('item-name').value,
    quantity: document.getElementById('quantity').value,
    units: document.getElementById('units').value,
    category: document.getElementById('category').value,
  };

  items.push(item);
  sessionStorage.setItem('data', JSON.stringify(items));

  clearForm();
  updateTable(items);

  document.getElementById('item-name').focus();
}


function clearForm() {
  document.getElementsByClassName('form-control').value = '';
}


function activateBtnsInTable() {
  let editBtns = document.getElementsByClassName('edit');
  let deleteBtns = document.getElementsByClassName('delete');

  for (let btn of editBtns) {
    btn.addEventListener('click', function() {
      editEntry(btn.id)
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
  document.getElementById('edit-btn').addEventListener('click', saveChanges);
}


function enterEditMode(index) {
  document.getElementById('item-id').value = items[index].id;
  document.getElementById('item-name').value = items[index].name;
  document.getElementById('quantity').value = items[index].quantity;
  document.getElementById('units').value = items[index].units;
  document.getElementById('category').value = items[index].category;

  document.getElementById('add-btn').style = 'display: none';
  document.getElementById('edit-btn').style = '';
}


function saveChanges() {
  let itemId = document.getElementById('item-id').value;

  let item = items.filter(task => task.id == itemId)[0];

  item.id = parseInt(document.getElementById('item-id').value);
  item.name = document.getElementById('item-name').value;
  item.quantity = document.getElementById('quantity').value;
  item.units = document.getElementById('units').value;
  item.category = document.getElementById('category').value;

  updateTable(items);
  sessionStorage.setItem('data', JSON.stringify(items));
  clearForm();

  document.getElementById('add-btn').style = '';
  document.getElementById('edit-btn').style = 'display: none;';
  document.getElementById('item-name').focus();
}