import React, { useEffect } from 'react';
import { useObserver, useLocalObservable } from 'mobx-react';
import store from '../model/store';


export default function List() {
  const localStore = useLocalObservable(() => store);
  return useObserver(() => <>{localStore.price}</>)
}