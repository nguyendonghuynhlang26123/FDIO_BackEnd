const dumbData = [
  {
    order_id: '1607609856820',
    order_name: 'Table #4',
    order_time: 1607609856820,
    foods: [
      { food_name: 'Pho', quantity: 3, status: 'waiting' },
      { food_name: 'Sting dau', quantity: 2, status: 'waiting' },
      { food_name: 'Tra da', quantity: 1, status: 'waiting' },
    ],
    note: 'Khong hanh, khong gia',
  },
  {
    order_id: '1607609995431',
    order_name: 'Table #1',
    order_time: 1607609995431,
    foods: [
      { food_name: 'Mi xao', quantity: 1, status: 'waiting' },
      { food_name: 'Com chien', quantity: 1, status: 'waiting' },
    ],
    note: 'Khong cay',
  },
];

// ---------------  GLOBAL VARIABLES ---------------------
const ACTIVE = 'selected';

let currentActiveId = '1607609995431';
let currentOrderList = [];

// ---------------- FUNCTIONS -----------------------
const displayTasks = (orderId) => {
  let order = currentOrderList.find(
    (o) => o.order_id.toString() === orderId.toString()
  );
  if (order) {
    let parent = document.querySelector('[data-tasks]');
    parent.innerHTML = '';

    order.foods.forEach((food) => {
      let node = document
        .getElementById('task-template')
        .content.cloneNode(true);

      console.log(node);
      node.querySelector('[data-name]').textContent = food.food_name;

      parent.appendChild(node);
    });

    document.querySelector('[data-order-note]').textContent = '*' + order.note;
  }
};

const setActiveOrder = (nextActiveId) => {
  if (currentActiveId)
    document.getElementById(currentActiveId).classList.remove(ACTIVE);
  document.getElementById(nextActiveId).classList.add(ACTIVE);

  currentActiveId = nextActiveId;
  displayTasks(currentActiveId);
};

const subtractTime = (prevTime) => {
  let time = Date.now() - prevTime;
  let diffHr = Math.floor((time % 86400000) / 3600000);
  let diffMins = Math.round(((time % 86400000) % 3600000) / 60000);
  return `${diffHr == 0 ? '' : diffHr + 'h'} ${diffMins}`;
};

const createOrderElement = (order, template) => {
  let node = template.content.cloneNode(true);

  node.querySelector('[data-order]').setAttribute('id', order.order_id);
  node
    .querySelector('[data-order]')
    .setAttribute('data-order-id', order.order_id);
  node.querySelector('[data-order-title]').textContent = order.order_name;
  node.querySelector('[data-order-time]').textContent = `${subtractTime(
    order.order_time
  )} mins`;

  return node;
};

const renderTemplates = (data) => {
  const parentElement = document.querySelector('[data-order-list]');
  const template = document.getElementById('order-template');
  parentElement.innerHTML = '';
  data.forEach((order) => {
    parentElement.appendChild(createOrderElement(order, template));
  });

  //render task
  setActiveOrder(currentActiveId);
};

// ---------------- EVENT HANDLER ---------------------
const orderItemClicked = (ev) => {
  ev.preventDefault();

  const nextId = ev.target.closest('[data-order]');
  setActiveOrder(nextId.id);
};

// ---------------- SCRIPT RUNNING ---------------------
currentOrderList = dumbData;
renderTemplates(dumbData);

document.querySelectorAll('[data-order]').forEach((element) => {
  element.addEventListener('click', orderItemClicked);
});
