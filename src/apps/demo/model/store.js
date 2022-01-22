import { makeAutoObservable } from 'mobx';
import { queryArticleList } from './server';

class Store {
  price = 1;

  amount = 10;

  constructor() {
    makeAutoObservable(this);
  }

  get total() {
    return this.price * this.amount;
  }

  async getArticleList() {
    const { data: articleList } = await queryArticleList();
    console.log(articleList);
  }

  changePrice() {
    this.price += 1;
  }
}

const store = new Store();

export default store;
