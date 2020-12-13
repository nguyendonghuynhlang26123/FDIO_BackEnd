class ManagerController {
  constructor(data, socket) {
    console.log(data);
    this.socket = socket;
    this.currentActiveId = data[0]._id;
    this.currentOrderList = data;

    this.renderTemplates();
  }

  //Public Fns
  addNewOrder = (newOrder) => {
    this.currentOrderList.push(newOrder);
    if (this.currentOrderList.length === 1) {
      this.currentActiveId = newOrder._id;
      this.setActiveOrder(this.currentActiveId);
    }

    document
      .querySelector('[data-order-list]')
      .appendChild(this.createOrderElement(newOrder));
  };

  // TEMPLATE GENERATORS:
  createTask = (food) => {
    let node = document.getElementById('task-template').content.cloneNode(true);
    node.querySelector('[data-name]').textContent = food.food_name;
    node.querySelector('[data-task]').setAttribute('data-task-id', food.food);

    node.querySelector('[data-holder]').classList = food.status;

    //EVENTS
    node
      .querySelector('[data-btn-accept]')
      .addEventListener('click', this.acceptButtonClicked);

    node
      .querySelector('[data-btn-done]')
      .addEventListener('click', this.doneButtonClicked);

    node
      .querySelector('[data-btn-deny]')
      .addEventListener('click', this.denyButtonPressed);

    return node;
  };

  createOrderElement = (order, template = null) => {
    if (!template) template = document.getElementById('order-template');
    let node = template.content.cloneNode(true);

    node.querySelector('[data-order]').setAttribute('id', order._id);
    node.querySelector('[data-order]').setAttribute('data-order-id', order._id);
    node.querySelector(
      '[data-order-title]'
    ).textContent = `Table #${order.table_id}`;
    node.querySelector('[data-order-time]').textContent = `${subtractTime(
      order.time_order
    )} mins`;

    node
      .querySelector('[data-order]')
      .addEventListener('click', this.orderItemClicked);
    return node;
  };

  // -------------- DISPLAY --------------------
  displayTasks = () => {
    let order = this.currentOrderList.find(
      (o) => o._id.toString() === this.currentActiveId.toString()
    );
    if (order) {
      let parent = document.querySelector('[data-tasks]');
      parent.innerHTML = '';

      order.list_order_item.forEach((food) => {
        parent.appendChild(this.createTask(food));
      });

      document.querySelector('[data-order-note]').textContent =
        '*' + order.note;
    }
  };

  setActiveOrder = (nextActiveId) => {
    if (this.currentActiveId)
      document.getElementById(this.currentActiveId).classList.remove(ACTIVE);
    document.getElementById(nextActiveId).classList.add(ACTIVE);

    this.currentActiveId = nextActiveId;
    this.displayTasks();
  };

  renderTemplates = () => {
    const parentElement = document.querySelector('[data-order-list]');
    const template = document.getElementById('order-template');
    parentElement.innerHTML = '';
    this.currentOrderList.forEach((order) => {
      parentElement.appendChild(this.createOrderElement(order, template));
    });

    //render task
    this.setActiveOrder(this.currentActiveId);
  };

  //HELPERS
  orderIsCompleted = (orderId) => {
    let order = this.currentOrderList.find(
      (o) => o._id.toString() === orderId.toString()
    );
    if (!order) return false;

    for (let index = 0; index < order.list_order_item.length; index++) {
      if (order.list_order_item[index].status !== DONE) return false;
    }

    return true;
  };

  // ---------------- EVENT HANDLER ---------------------
  orderItemClicked = (ev) => {
    ev.preventDefault();

    const nextId = ev.target.closest('[data-order]');
    this.setActiveOrder(nextId.id);
  };

  acceptButtonClicked = (ev) => {
    ev.preventDefault();

    //Get id of that food
    let taskElement = ev.target.closest('[data-task]');
    let id = taskElement.getAttribute('data-task-id');

    //TODO: Send FCM
    console.log('FCM', id, 'Status = Processing');

    //TODO: Update Collection => refresh

    //Update state
    taskElement.querySelector('[data-holder]').classList = '';
    taskElement.querySelector('[data-holder]').classList = PROCESSING;
  };

  doneButtonClicked = (ev) => {
    ev.preventDefault();

    //element
    let taskElement = ev.target.closest('[data-task]');
    let id = taskElement.getAttribute('data-task-id');

    //TODO: Send FCM
    console.log('FCM', id, 'Status = Processing');

    //TODO: Update state

    //TODO: if All is checked => Store DB order, delete orderqueue
    //TODO: else update state only
    if (this.orderIsCompleted(this.currentActiveId))
      console.log('DELETE & STORE TO ORDER COLLECTION', id);
    else console.log('UPDATE STATE ONLY');

    //UPDATE STATE
    taskElement.querySelector('[data-holder]').classList = '';
    taskElement.querySelector('[data-holder]').classList = DONE;
  };

  denyButtonPressed = (ev) => {
    ev.preventDefault();
    console.log('deny');

    let taskElement = ev.target.closest('[data-task]');
    let id = taskElement.getAttribute('data-task-id');

    //DISABLE THAT TASK

    //STORE HIDDEN DATA
    document.querySelector('[data-deny-table-id]').value = this.currentActiveId;
    document.querySelector('[data-deny-food-id]').value = id;
    document.querySelector('[data-deny-note]').value = '';

    //SHOW MODAL
    let check = document.getElementById('modal-toggle').checked;
    document.getElementById('modal-toggle').checked = !check;

    //TODO: RELOAD DATA AND RENDER
  };
}

// ---------------- FUNCTIONS -----------------------

//HTTP REquest

// ---------------- SCRIPT RUNNING ---------------------

window.addEventListener('load', () => {
  console.log('START');
  fetch('/order-queue').then((response) => {
    if (response.status !== 200)
      console.log('GET ERROR, code: ', response.status);
    else {
      response.json().then((data) => {
        console.log(data);
      });
    }
  });
});

const socket = io('/manager');
let mc = null;

socket.on('init', (data) => {
  console.log(data);
  mc = new ManagerController(data, socket);
});

socket.on('addOrder', (data) => {
  console.log(data);
  mc.addNewOrder(data);
});
