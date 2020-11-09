import { combineReducers } from 'redux'

import main from './main'
import Orders from './Orders';
import orderInfo from './orderInfo';
import auth from './auth';
import review from './review';
import cart from './cart';
import order from './order';
import usersInfo from './users_info';
import crud from './crud';
import wishlist from './wishlist';

export default combineReducers({
  auth,
  wishlist,
  main,
  review,
  cart,
  order,
  crud,
  Orders,
  orderInfo,
  usersInfo
})