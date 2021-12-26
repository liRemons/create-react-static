import { service } from './req'

 
export const queryTechClassList = () => {
  return service({
    method: "get",
    url: "/content/queryTechClassList",
  });
};