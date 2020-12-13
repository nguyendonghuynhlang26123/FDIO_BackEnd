import * as express from 'express';
import { AuthService } from './auth.service';
const router = express.Router();

const authService: AuthService = new AuthService();

router.get('/login', (req, res) => {
  if (req.session.auth) res.redirect('/docs');
  else
    res.render('pages/loginPage', {
      message: req.session.error,
    });
});

router.post('/login', (req, res) => {
  authService.authenticate(
    req.body.username,
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(
          'log ~ file: auth.api.ts ~ line 21 ~ router.post ~ err',
          err
        );
      }

      if (user) {
        req.session.regenerate(() => {
          req.session.auth = true;
          req.session.userId = user._id;
          res.redirect('/manager');
        });
      } else {
        req.session.error = `${err}. Authentication failed, please check your username and password.`;
        res.redirect('/login');
      }
    }
  );
});

// router.get("/register", (req, res) => {
//   res.render("signing/register", {
//     link: "/style/css/signing.css",
//     message: req.session.error,
//   });
// });

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
