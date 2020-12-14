const socket = io('/kitchen');
const displayDOM = document.querySelector('[data-queue-container]');

let currentQueue = [];

const createOrderCard = (order) => {
  const template = document.getElementById('order-template');
  let node = template.content.cloneNode(true);

  node.querySelector('[data-order]').id = order.order_id + order.food_id;
  node.querySelector(
    '[data-order-title]'
  ).textContent = `${order.food_name} x ${order.quantity}`;
  node.querySelector('[data-order-note]').textContent = order.note;
  node.querySelector('[data-table-id]').textContent = 'Table#' + order.table_id;

  return node;
};

socket.on('init', (data) => {
  currentQueue = data; 
  currentQueue.forEach((order) => {
    displayDOM.appendChild(createOrderCard(order));
  });
});

socket.on('acceptOrder', (newOrder) => {
  currentQueue.push(newOrder);
  displayDOM.appendChild(createOrderCard(newOrder));
});

socket.on('removeOrder', (id) => {
  currentQueue = currentQueue.filter(
    (order) => order.order_id + order.food_id !== id
  );

  document.getElementById(id).remove();
});
