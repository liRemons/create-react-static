import { makeAutoObservable } from 'mobx'

class Store {
  price = 1;
  amount = 10;
  constructor(){
    makeAutoObservable(this); 
  }

  get total() {
    return this.price * this.amount;
  }

  changePrice() {
    this.price ++
  }
}

const store  = new Store();

export default store;