import React from 'react';
import { useObserver, useLocalObservable } from 'mobx-react';
import store from '../model/store';
import style from './index.module.less'


export default function List() {
  const localStore = useLocalObservable(() => store);
  return useObserver(() => <div className={style.container}>
    <div>hello world</div>
    <div>HMR</div>
    <input type="text" />
    <div>
      {localStore.price}
    </div>
  </div>)
}