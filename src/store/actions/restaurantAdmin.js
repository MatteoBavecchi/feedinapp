import {
  SET_RESTAURANT_ADMIN,
  SET_LOCATION_ADMIN,
  SET_MENU_ADMIN,
  SET_CATEGORIES_ADMIN,
  SET_ORDERS_ADMIN,
  SET_TABLES_ADMIN
} from "./actionTypes";
import { DeviceEventEmitter } from "react-native";
import Beacons from 'react-native-beacons-manager';

import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import { Navigation } from "react-native-navigation";

import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

var dbRef = database();
var contactsRef = dbRef.ref('contacts');
var usersRef = dbRef.ref('users');
var menuRef = dbRef.ref('menu');
var tablesRef = dbRef.ref('tables');
var restaurantsRef = dbRef.ref('restaurants');
var categoriesRef = dbRef.ref('categories');
var locationsRef = dbRef.ref('locations');
var beaconsRef = dbRef.ref('beacons');
var locationBeaconRef = dbRef.ref('locationBeacon');
var locationItemRef = dbRef.ref('locationItem');
var ordersRef = dbRef.ref('orders');
var Auth = null;

export const getRestaurantAdminDataByKey = restaurantKey => {
  return async dispatch => {
    console.log("entrato in getRestaurantAdminData");
    await restaurantsRef.child(restaurantKey)
      .once("value").then(snapshot => {
        let parsedRes = snapshot.val();
        dispatch(setRestaurantAdminData(parsedRes));
        if (snapshot.val().allowLocations === "true") {
          dispatch(getLocationAdminDataByBeaconKey(beaconkey)); // 28/09/2019 VEDERE QUESTO METODO, OTTIMIZZARLO
        }
        else {
          dispatch(getMenuAdminDataByRestaurantKey(restaurantKey));
        }
        dispatch(goToAdmin());
      })
  }
}

export const getMenuAdminDataByRestaurantKey = restaurantKey => {
  return async dispatch => {
    var numberOfItems = 0;
    menuRef.child(restaurantKey + "/numberOfElements").on("value", snapshot => {
      numberOfItems = snapshot.val();
    });
    tablesRef.child(restaurantKey + "/items").on("value", snapshot => {
      let response = snapshot.val();
      let tables = [];
      for (let key in response) {
        tables.push({
          name: response[key].name,
          tableKey: response[key].tableKey
        });
      }
      dispatch(setTables(tables));
    });

    menuRef.child(restaurantKey + "/items").orderByChild("items/position").on("value", snapshot => {
      let response = snapshot.val();
      let menu = [];
      for (let key in response) {
        menu.push({
          name: response[key].name,
          description: response[key].description,
          price: response[key].price,
          categoryKey: response[key].categoryKey,
          locations: null,
          position: response[key].position,
          restaurantKey: response[key].restaurantKey,
          available: response[key].available ? true : false,
          bio: response[key].bio ? true : false,
          vegetarian: response[key].vegetarian ? true : false,
          vegan: response[key].vegan ? true : false,
          glutenFree: response[key].glutenFree ? true : false,
          frozen: response[key].frozen ? true : false,
          userKey: response[key].userKey,
          itemKey: response[key].itemKey
        });
      }

      dispatch(setMenuAdminData(menu.reverse(), numberOfItems));
      dispatch(getOrders(restaurantKey));
    });
    var numberOfCategories = 0;
    categoriesRef.child(restaurantKey + "/numberOfElements").on("value", snapshot => {
      numberOfCategories = snapshot.val();
    });
    categoriesRef.child(restaurantKey + "/categories").orderByChild("categories/position").on("value", snapshot => {
      let categories = [];
      for (let key in snapshot.val()) {
        categories.push(snapshot.val()[key]);
      }
      dispatch(setCategoriesAdminData(categories.reverse(), numberOfCategories));
    });
  }
}

export const setTables = tables => {
  return {
    type: SET_TABLES_ADMIN,
    tables: tables
  };
};

export const getLocationAdminDataByBeaconKey = beaconKey => { // Da verificare
  return async dispatch => {
    var locationKey = null;
    let parsedResponse = await locationBeaconRef.orderByChild(beaconKey).equalTo(true).once("value");
    locationKey = Object.keys(parsedResponse.val())[0];
    locationsRef.child(locationKey).once("value").then(snapshot => {
      let parsedRes = snapshot.val();
      let location = {
        name: parsedRes.name,
        outdoor: (parsedRes.outdoor) ? true : false,
        restaurantKey: parsedRes.restaurantKey,
        description: parsedRes.description,
        userKey: parsedRes.userKey,
        locationKey: parsedRes.locationKey,
        beaconKeys: []
      }
      for (let key in parsedRes.beaconKeys) {
        location.beaconKeys.push({
          [key]: true
        });
      }
      dispatch(setLocationAdminData(location));
      dispatch(getMenuAdminDataByLocation(location));
    })
  }
}

export const setLocationAdminData = location => {
  return {
    type: SET_LOCATION_ADMIN,
    location: location
  };
};



export const setMenuAdminData = (menu, numberOfItems) => {
  return {
    type: SET_MENU_ADMIN,
    menu: menu,
    numberOfItems: numberOfItems
  };
}

export const setCategoriesAdminData = (categories, numberOfCategories) => {
  return {
    type: SET_CATEGORIES_ADMIN,
    categories: categories,
    numberOfCategories: numberOfCategories
  };
}

export const setRestaurantAdminData = restaurant => {
  return {
    type: SET_RESTAURANT_ADMIN,
    restaurant: restaurant
  };
};

export const goToAdmin = () => {
  return dispatch => {
    Promise.all([
      Icon.getImageSource(Platform.OS === 'android' ? "md-map" : "ios-map", 30),
      Icon.getImageSource(Platform.OS === 'android' ? "md-share-alt" : "ios-share", 30),
      Icon.getImageSource(Platform.OS === 'android' ? "md-menu" : "ios-menu", 30)
    ]).then(sources => {
      console.log("ora vado ad admin");
      Navigation.setRoot({
        root: {
          bottomTabs: {
            options: {
              bottomTabs: {
                backgroundColor: 'white',
                currentTabIndex: 0,
              },
            },
            children: [
              {
                component: {
                  name: 'RNFirebaseStarter.HomeAdmin',
                  passProps: {
                    text: 'This is tab 1',
                    myFunction: () => 'Hello from a function!',
                  },
                  options: {
                    bottomTab: {
                      icon: sources[0],
                      selectedIconColor: 'black',
                      text: "Home"
                    },
                    bottomTabs: {
                      titleDisplayMode: 'alwaysShow'
                    }
                  }
                },
              },
              {
                component: {
                  name: 'RNFirebaseStarter.Comande',
                  options: {
                    bottomTab: {
                      icon: sources[1],
                      selectedIconColor: 'black',
                      text: "Comande"
                    },
                    bottomTabs: {
                      titleDisplayMode: 'alwaysShow'
                    }
                  }
                },
              },
            ],
          },
        }
      })

    })

  }
}

export const loginRestaurant = (user, password) => {
  return async dispatch => {
    auth().signInWithEmailAndPassword(user, password)
      .then(authData => {
        Auth = authData.user;
        usersRef.child(Auth.uid + "/restaurantKey").once("value", snapshot => {
          let restaurantKey = snapshot.val();
          dispatch(getRestaurantAdminDataByKey(restaurantKey));
        });

      })
      .catch(error => {
        console.log("Login Failed!", error);
      });
  }
}


export const setOrders = orders => {
  return {
    type: SET_ORDERS_ADMIN,
    orders: orders
  };
};

export const updateOrder = (orders, table, comments, locationKey, restaurantKey) => {
  return async dispatch => {
    if (Auth != null) {
      ordersRef
        .push({
          restaurantKey: restaurantKey,
          locationKey: locationKey,
          comments: comments,
          table: table,
          orders: orders,
          userKey: Auth.uid,
          datetime: Date.now()
        }).then((snap) => {
          ordersRef.child(snap.key).update({
            orderKey: snap.key
          });
        });
    } else {
      //inform user to login
    }
  }
}

export const getOrders = restaurantKey => {
  return async dispatch => {
    ordersRef.child(restaurantKey + "/orders").on("value", snapshot => {
      parsedRes = snapshot.val();
      let orders = [];
      for (let key in parsedRes) {
        orders.push(parsedRes[key]);
      }
      dispatch(setOrders(orders));
    })
  }
}

export const deleteOrder = (restaurantKey, orderKey) => {
  return async dispatch => {
    ordersRef.child(restaurantKey + "/orders/" + orderKey).update({ deleted: true }).then(res => {
      /*ordersRef.child(restaurantKey + "/showOrders").transaction(function (number) {
        if (number) {
          number = number - 1;
        }
        return number;
      });
      ordersRef.child(restaurantKey + "/hideOrders").transaction(function (number) {
        if (number) {
          number = number + 1;
        }
        return number;
      });*/
    });
  }
}