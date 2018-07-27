import { menuData as menus } from '@/config/menuData';

function getKeys(menus) {
  let keys = [];
  menus.forEach(item => {
    if (item.children) {
      item.children.forEach(m => {

        let obj = {
          path: item.url + '/' + m.url,
          exact: true,
        }
        obj.component = function (location, cb) {
          require.ensure([], function (require) {
            let  C = require(`../components/${item.url}/${m.url}`);
             cb(null,C[Object.keys(C)[0]]);
          });
        }
        keys.push(obj);
      })

    } else {
      let obj = {
        path: item.url,
        exact: true
      }

      obj.component = function (location, cb) {
        require.ensure([], function (require) {
          let  C = require(`../components/${item.url}`);
             cb(null,C[Object.keys(C)[0]]);
        });
      }
      keys.push(obj)
    }
  })
  return keys;
}

const routes = getKeys(menus);
export default routes;

 
