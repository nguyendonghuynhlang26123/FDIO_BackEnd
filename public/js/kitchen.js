const socket = io('/kitchen');
const displayDOM = document.querySelector('[data-queue-container]');

let currentQueue = [];

const createOrderCard = (order) => {
  const template = document.getElementById('order-template');
  let node = template.content.cloneNode(true);

  node.querySelector('[data-order-title]').textContent = order.food_name;
  node.querySelector('[data-order-note]').textContent = order.note;
  node.querySelector('[data-table-id]').textContent = 'Table#' + order.table_id;

  return node;
};

socket.on('init', (data) => {
  currentQueue = data;
  console.log('log ~ file: kitchen.js ~ line 19 ~ socket.on ~ data', data);
  currentQueue.forEach((order) => {
    displayDOM.appendChild(createOrderCard(order));
  });
});

socket.on('acceptOrder', (newOrder) => {
  currentQueue.push(newOrder);
  displayDOM.appendChild(createOrderCard(newOrder));
});
