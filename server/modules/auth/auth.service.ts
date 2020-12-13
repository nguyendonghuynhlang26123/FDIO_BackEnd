import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';

export class AuthService {
  constructor(private userService: UserService = new UserService()) {}

  async authenticate(username, password, fn) {
    console.log(
      'log ~ file: auth.service.ts ~ line 8 ~ AuthService ~ authenticate ~ username',
      username
    );
    console.log(
      'log ~ file: auth.service.ts ~ line 8 ~ AuthService ~ authenticate ~ password',
      password
    );
    try {
      const user = await this.userService.findUserByUsername(username);
      if (!user) return fn(new Error('Cannot find user'));
      if (!bcrypt.compareSync(password, user.password))
        return fn(new Error('Invalid password'));
      return fn(null, user);
    } catch (err) {
      return fn(err, null);
    }
  }

  async restrict(req, res, next) {
    if (req.session.auth) {
      next();
    } else {
      req.session.error = 'Access denied! Please login.';
      res.redirect('/login');
    }
  }
}
