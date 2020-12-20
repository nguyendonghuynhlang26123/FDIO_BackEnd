class ManagerController {
  constructor(data, socket) {
    console.log(data);
    this.socket = socket;
    this.currentActiveId = data[0]._id;
    this.currentOrderList = data;

    this.renderTemplates();
    document
      .querySelector('[data-modal-btn]')
      .addEventListener('click', this.modalBtnPressed);

    //BTN Events
    this.setAcceptAllHandler();
    this.setRemoveCompletedHandler();

    //Interval
    this.trackingTimeHandler();
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
    node.querySelector(
      '[data-name]'
    ).textContent = `${food.food_name} x ${food.quantity}`;
    node.querySelector('[data-task]').id = food.food;
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

    this.acceptAllBtnToggle();
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

  setStatus = (status, id) => {
    let food = null;
    let targetOrder = null;
    //UPDATE CURRENT LIST
    this.currentOrderList = this.currentOrderList.map((order) => {
      if (order._id.toString() !== this.currentActiveId) return order;
      targetOrder = order;
      order.list_order_item = order.list_order_item.map((f) => {
        if (f.food !== id) return f;
        food = f;
        return { ...f, status: status };
      });
      return order;
    });

    //SEND REQUEST TO SERVER TO UPDATE DB
    let path = `/order-queue/update-status/${this.currentActiveId}`;
    sendHTTPRequest('PUT', path, {
      foodId: id,
      status: status,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        alert(`Set status error! Error: ${err}`);
      });

    //SEND SOCKET
    if (status !== WAITING) {
      this.socket.emit(status, {
        order_id: this.currentActiveId,
        food_id: id,
        food_name: food.food_name,
        quantity: food.quantity,
        table_id: targetOrder.table_id,
        note: targetOrder.note,
        token: targetOrder.token,
      });
    }

    //UPDATE UI
    document.getElementById(id).querySelector('[data-holder]').classList = '';
    document
      .getElementById(id)
      .querySelector('[data-holder]').classList = status;
    this.acceptAllBtnToggle();
  };

  //HELPERS
  orderIsProcessing = (orderId) => {
    let order = this.currentOrderList.find(
      (o) => o._id.toString() === orderId.toString()
    );
    if (!order) return false;

    for (let index = 0; index < order.list_order_item.length; index++) {
      if (order.list_order_item[index].status !== PROCESSING) return false;
    }

    return true;
  };

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

  getFood = (foodId) => {
    for (const order of this.currentOrderList) {
      let food = order.list_order_item.find(
        (f) => f.food.toString() === foodId.toString()
      );
      if (food) return food;
    }
  };

  toggleModal = () => {
    let check = document.getElementById('modal-toggle').checked;
    document.getElementById('modal-toggle').checked = !check;
  };

  changeStatusInCurList = () => {};

  // ---------------- EVENT HANDLER ---------------------
  acceptAllBtnToggle = () => {
    if (
      this.orderIsProcessing(this.currentActiveId) ||
      this.orderIsCompleted(this.currentActiveId)
    )
      document.querySelector('[data-accept-all-order]').classList.add(DISABLE);
    else
      document
        .querySelector('[data-accept-all-order]')
        .classList.remove(DISABLE);
  };

  orderItemClicked = (ev) => {
    ev.preventDefault();

    const nextId = ev.target.closest('[data-order]');
    this.setActiveOrder(nextId.id);
  };

  acceptButtonClicked = (ev) => {
    ev.preventDefault();

    //Get id of that food
    let taskElement = ev.target.closest('[data-task]');
    let id = taskElement.getAttribute('id');
    let food = this.getFood(id);
    let order = this.currentOrderList.find(
      (o) => o._id.toString() === this.currentActiveId.toString()
    );

    this.setStatus(PROCESSING, id);
  };

  doneButtonClicked = (ev) => {
    ev.preventDefault();

    //element
    let taskElement = ev.target.closest('[data-task]');
    let id = taskElement.getAttribute('id');

    this.setStatus(DONE, id);
  };

  denyButtonPressed = (ev) => {
    ev.preventDefault();
    console.log('deny');

    let taskElement = ev.target.closest('[data-task]');
    let id = taskElement.getAttribute('id');

    //DISABLE THAT TASK

    //STORE HIDDEN DATA
    document.querySelector('[data-deny-table-id]').value = this.currentActiveId;
    document.querySelector('[data-deny-food-id]').value = id;
    document.querySelector('[data-deny-note]').value = '';

    //SHOW MODAL
    this.toggleModal();
  };

  modalBtnPressed = (ev) => {
    ev.preventDefault();
    let parent = ev.target.parentElement;
    let id = parent.querySelector('[data-deny-food-id]').value;

    this.toggleModal();
    this.setStatus(DENY, id);

    sendHTTPRequest('PUT', '/order-queue/deny', {
      table_id: parent.querySelector('[data-deny-table-id]').value,
      food_id: parent.querySelector('[data-deny-food-id]').value,
      note: parent.querySelector('[data-deny-note]').value,
    }).then((response) => {
      console.log(response);
    });
  };

  //BUTTON EVENTS
  setAcceptAllHandler = () => {
    document
      .querySelector('[data-accept-all-order]')
      .addEventListener('click', (ev) => {
        ev.preventDefault();
        document
          .querySelector('[data-accept-all-order]')
          .classList.add(DISABLE);

        let order = this.currentOrderList.find(
          (order) => order._id.toString() === this.currentActiveId
        );

        for (const food of order.list_order_item) {
          this.setStatus(PROCESSING, food.food);
        }
      });
  };

  setRemoveCompletedHandler = () => {
    document
      .querySelector('[data-remove-complete]')
      .addEventListener('click', (ev) => {
        this.currentOrderList = this.currentOrderList.filter((order) => {
          if (this.orderIsCompleted(order._id)) {
            document.getElementById(order._id).remove();
            return false;
          }
          return true;
        });

        this.currentActiveId = this.currentOrderList[0]._id;
        this.setActiveOrder(this.currentActiveId);
      });
  };

  trackingTimeHandler = () => {
    let trackTime = () => {
      this.currentOrderList.forEach((order) => {
        console.log(order);
        let time = subtractTime(order.time_order);
        document
          .getElementById(order._id)
          .querySelector('[data-order-time]').textContent = time;

        if (isTooLong(order.time_order))
          document.getElementById(order._id).classList.add('prioritized');
      });
    };

    trackTime();
    setInterval(() => {
      trackTime();
      console.log('re track');
    }, 60000);
  };
}

// ---------------- FUNCTIONS -----------------------

//HTTP REquest

// ---------------- SCRIPT RUNNING ---------------------

window.addEventListener('load', () => {
  console.log('START');
});

const socket = io('/manager');
let mc = null;

const debugMode = (data) => {
  data = data.map((order) => {
    order.list_order_item = order.list_order_item.map((f) => ({
      ...f,
      status: WAITING,
    }));
  });
};

socket.on('init', (data) => {
  //debugMode(data);
  console.log(data);
  mc = new ManagerController(data, socket);
});

socket.on('addOrder', (data) => {
  console.log(data);
  mc.addNewOrder(data);
});
