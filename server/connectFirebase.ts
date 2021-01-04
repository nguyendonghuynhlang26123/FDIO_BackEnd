import * as admin from 'firebase-admin';

const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    'https://food-dine-in-ordering-system-default-rtdb.firebaseio.com',
});

export const db = admin.firestore();

export const sendFcmNotification = (
  token,
  title,
  body,
  orderId = '',
  foodId = '',
  status = ''
) => {
  let message = {
    data: {
      orderId: orderId,
      foodId: foodId,
      status: status,
      title: title,
      body: body,
    },
    token: token,
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log('Successfully send FCM message: ', response);
    })
    .catch((err) => {
      console.log('ERROR! ', err);
    });
};
