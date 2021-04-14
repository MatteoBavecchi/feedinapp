import {
  SET_RESTAURANT,
  SET_NEAREST_BEACON_DATA,
  SET_NEAR_BEACONS_DATA,
  SET_NEAREST_BEACON_KEYS,
  SET_LOCATION,
  SET_MENU,
  SET_CATEGORIES,
  SET_ORDERS,
  SET_TABLES,
  SET_RESTAURANT_SEARCH_RESULTS,
  RESET_RESTAURANT_DATA,
  SET_HISTORY,
  SET_NEAR_RESTAURANTS,
  RESET_BEACONS_DATA,
  SET_POSTS
} from "./actionTypes";
import { DeviceEventEmitter } from "react-native";
import { uiStartLoading, uiStopLoading } from "./index";

import Beacons from 'react-native-beacons-manager';

import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import { Navigation } from "react-native-navigation";
import AsyncStorage from '@react-native-community/async-storage';
import PushNotification from "react-native-push-notification";

var dbRef = database();
var usersRef = dbRef.ref('users');
var menuRef = dbRef.ref('menu');
var restaurantsRef = dbRef.ref('restaurants');
var categoriesRef = dbRef.ref('categories');
var locationsRef = dbRef.ref('locations');
var beaconsRef = dbRef.ref('beacons');
var locationItemRef = dbRef.ref('locationItem');
var ordersRef = dbRef.ref('orders');
var tablesRef = dbRef.ref('tables');
var postsRef = dbRef.ref('post');
var catSortRef = dbRef.ref('catSort');
var restaurantKey = null;
var Auth = null;
var beaconsDidRangeEventAndroid = null;
var beaconsDidRangeEventIos = null;

export const stopRangingAndroid = region => {
  return dispatch => {
    // stop ranging beacons:
    Beacons
      .stopRangingBeaconsInRegion(region)
      .then(() => console.log('Beacons ranging stopped succesfully'))
      .catch(error => console.log(`Beacons ranging not stopped, error: ${error}`));

    // remove ranging event we registered at componentDidMount
    beaconsDidRangeEventAndroid.remove();
  }
}

export const stopRangingIos = region => {
  return dispatch => {
    // stop ranging beacons:
    Beacons
      .stopRangingBeaconsInRegion(region)
      .then(() => console.log('Beacons ranging stopped succesfully'))
      .catch(error => console.log(`Beacons ranging not stopped, error: ${error}`));
    // remove ranging event we registered at componentDidMount:
    beaconsDidRangeEventIos.remove();
  }
}

export const getBeaconDataAndroid = region => {
  return dispatch => {
    dispatch(uiStartLoading());
    // Start detecting all iBeacons in the nearby
    Beacons.detectIBeacons();
    Beacons.startRangingBeaconsInRegion('restaurantBeacon', '7005c5dc-4bc2-4164-b1ed-fc10fbb5c6af').then((data) => {
      console.log("Start searching...");
    }).catch((reason) => {
      console.log(reason);
    });

    //Print a log of the detected iBeacons (1 per second)
    beaconsDidRangeEventAndroid = DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
      if (data.beacons.length > 0) {
        //console.log(data);
        let beaconData = [];
        let parsedRes = data.beacons;
        for (let key in parsedRes) {
          let uuid_major_minor = parsedRes[key].uuid + '_' + parsedRes[key].major + '_' + parsedRes[key].minor;
          beaconsRef
            .orderByChild("uuid_major_minor")
            .equalTo(uuid_major_minor.toLowerCase())
            .once("value").then(snapshot => {
              let beaconkey = Object.keys(snapshot.val())[0];
              let restaurantKey = snapshot.val()[beaconkey].restaurantKey;
              let locationKey = snapshot.val()[beaconkey].locationKey;
              let locationName = snapshot.val()[beaconkey].locationName;
              beaconData.push({
                uuid: region.uuid,
                major: parsedRes[key].major,
                minor: parsedRes[key].minor,
                proximity: parsedRes[key].proximity,
                distance: parsedRes[key].distance,
                rssi: parsedRes[key].rssi,
                beaconKey: beaconkey,
                restaurantKey: restaurantKey,
                locationKey: locationKey,
                locationName: locationName
              });
            }).then(snap => {
              /* if (parsedRes[key].proximity == "near" || parsedRes[key].proximity == "immediate") {
                  dispatch(setNearestBeaconData(beaconData[beaconData.length - 1]));
                }
                */
              var nearestBeacon = beaconData.reduce(function (a, b) {
                return (b.distance < a.distance) ? b : a;
              });
              dispatch(setNearestBeaconData(nearestBeacon));
              dispatch(setNearBeaconsData(beaconData));
              dispatch(getNearRestaurantData(beaconData));
            })
            .catch(e => {
              console.log(e);
            })
        }
      }
    });
  };
}

export const clearBeaconList = () => {
  return {
    type: RESET_BEACONS_DATA
  }
}

export const startMonitoringIos = region => {
  return dispatch => {
    Beacons.requestAlwaysAuthorization();
    Beacons.startMonitoringForRegion(region);
    DeviceEventEmitter.addListener(
      'regionDidEnter',
      (data) => {
        console.log("entrato in una regione!");
        console.log(data);
        // good place for background tasks
        PushNotification.localNotification({
          title: "Entrato Regione", // (optional)
          message: "Sono entrato nella regione " + data.major + ", " + data.minor, // (required)
          playSound: true // (optional) default: true
        });
      }
    );

    DeviceEventEmitter.addListener(
      'regionDidExit',
      ({ identifier, uuid, minor, major }) => {
        // good place for background tasks
        console.log('monitoring - regionDidExit data: ', { identifier, uuid, minor, major });
        PushNotification.localNotification({
          title: "Uscito Regione", // (optional)
          message: "Sono uscito dalla regione " + data.major + ", " + data.minor, // (required)
          playSound: true // (optional) default: true
        });
      }
    );
  }
}

export const startMonitoringAndroid = region => {
  return dispatch => {
    Beacons.detectIBeacons();
    Beacons.startMonitoringForRegion(region)
      .then(() => console.log('Beacons monitoring started succesfully'))
      .catch(error =>
        console.log(`Beacons monitoring not started, error: ${error}`),
      );

    DeviceEventEmitter.addListener('regionDidEnter', (data) => {
      console.log("entrato in una regione!");
      //start ranging e prendi major minor del beacon piu vicino
      // good place for background tasks
      PushNotification.localNotification({
        title: "Entrato Regione", // (optional)
        message: "Sono entrato nella regione " + data.major + ", " + data.minor, // (required)
        playSound: true // (optional) default: true
      });
    }
    );

    DeviceEventEmitter.addListener('regionDidExit', ({ identifier, uuid, minor, major }) => {
      // good place for background tasks
      console.log('monitoring - regionDidExit data: ', { identifier, uuid, minor, major });
      PushNotification.localNotification({
        title: "Uscito Regione", // (optional)
        message: "Sono uscito dalla regione " + data.major + ", " + data.minor, // (required)
        playSound: true // (optional) default: true
      });
    }
    );
  }
}


export const getBeaconDataIos = region => {
  return dispatch => {
    dispatch(uiStartLoading());
    // Request for authorization while the app is open
    Beacons.requestWhenInUseAuthorization()
    Beacons.startRangingBeaconsInRegion(region);
    Beacons.startUpdatingLocation();
    // Listen for beacon changes
    beaconsDidRangeEventIos = Beacons.BeaconsEventEmitter.addListener('beaconsDidRange', (data) => {
      if (data.beacons.length > 0) {
        //console.log(data);
        let beaconData = [];
        let parsedRes = data.beacons;
        for (let key in parsedRes) {
          let uuid_major_minor = parsedRes[key].uuid + '_' + parsedRes[key].major + '_' + parsedRes[key].minor;
          beaconsRef
            .orderByChild("uuid_major_minor")
            .equalTo(uuid_major_minor.toLowerCase())
            .once("value").then(snapshot => {
              let beaconkey = Object.keys(snapshot.val())[0];
              let restaurantKey = snapshot.val()[beaconkey].restaurantKey;
              let locationKey = snapshot.val()[beaconkey].locationKey;
              let locationName = snapshot.val()[beaconkey].locationName;
              beaconData.push({
                uuid: region.uuid,
                major: parsedRes[key].major,
                minor: parsedRes[key].minor,
                proximity: parsedRes[key].proximity,
                distance: parsedRes[key].distance,
                rssi: parsedRes[key].rssi,
                beaconKey: beaconkey,
                restaurantKey: restaurantKey,
                locationKey: locationKey,
                locationName: locationName
              });
            }).then(snap => {
              /* if (parsedRes[key].proximity == "near" || parsedRes[key].proximity == "immediate") {
                 dispatch(setNearestBeaconData(beaconData[beaconData.length - 1]));
               }
               */
              var nearestBeacon = beaconData.reduce(function (a, b) {
                return (b.distance < a.distance) ? b : a;
              });
              dispatch(setNearestBeaconData(nearestBeacon));
              dispatch(setNearBeaconsData(beaconData));
              dispatch(getNearRestaurantData(beaconData));

            })
            .catch(e => {
              console.log(e);
            })
        }
      }
    });
  };
}

export const setNearestBeaconData = beaconData => {
  return {
    type: SET_NEAREST_BEACON_DATA,
    beaconData: beaconData
  }
}

export const setNearBeaconsData = beaconsData => {
  return {
    type: SET_NEAR_BEACONS_DATA,
    beaconsData: beaconsData
  }
};

export const stopGetBeacons = region => {
  return dispatch => {
    dispatch(uiStopLoading());
    Beacons.stopRangingBeaconsInRegion(region).then(() => {
      console.log(`Beacons ranging stopped successfully`);
    }).catch((error) => {
      console.log("error: " + error)
    });
  }
}

export const getRestaurantData = (data) => {
  return async dispatch => {
    if (Auth != null) {
      console.log("entrato in getRestaurantData");
      restaurantsRef.child(data.restaurantKey).once("value", snapshot => {
        dispatch(setRestaurantData(snapshot.val()))
        if (snapshot.val().allowLocations && data.locationKey) {
          menuRef.child(data.restaurantKey + "/items").on("value", snapshot => {
            dispatch(getMenuDataByLocation(data));
          });
          //dispatch(getMenuDataByLocation(data));
        }
        else {
         
          dispatch(getMenuDataByRestaurantKey(data.restaurantKey));
        }
        if (snapshot.val().allowOrders) {
          dispatch(getTables(data.restaurantKey));
        }
        dispatch(getLastPosts(data.restaurantKey));
        dispatch(goToMenu());
        dispatch(storeRestaurantKey(data.restaurantKey));
      })
    }
  }
}

export const getLastPosts = (restaurantKey) => {
  return async dispatch => {
    if (Auth != null) {
      postsRef.child(restaurantKey + "/posts")
        // .orderByChild("data")
        //.startAt(Date.now())
        //.endAt(Date.now() - 10 * 1000 * 60 * 60 * 24)
        .on("value", snapshot => {
          dispatch(setPosts(snapshot.val()))
        })
    }
  }
}

export const setPosts = posts => {
  return {
    type: SET_POSTS,
    posts: posts
  };
};

export const storeRestaurantKey = restaurantKey => {
  return async dispatch => {
    try {
      const jsonValue = await AsyncStorage.getItem('@restaurant_History');
      let res = jsonValue != null ? JSON.parse(jsonValue) : null;

      if (res == null) {
        try {
          let resp = [];
          resp.push(restaurantKey);
          await AsyncStorage.setItem('@restaurant_History', JSON.stringify(resp))
        } catch (e) {
          // saving error
        }
      }
      else {
        if (res.indexOf(restaurantKey) == -1) {
          res.push(restaurantKey);
          await AsyncStorage.setItem('@restaurant_History', JSON.stringify(res));
        }
      }
    } catch (e) {
      // error reading value
    }
  }
}

export const getTables = restaurantKey => {
  return async dispatch => {
    tablesRef.child(restaurantKey + "/items").on("value", snapshot => {
      let parsedRes = snapshot.val();
      let tables = [];
      for (let key in parsedRes) {
        tables.push({
          name: parsedRes[key].name,
          tableKey: parsedRes[key].tableKey
        });
      }
      dispatch(setTables(tables.reverse()));
    })
  }
}

export const setTables = tables => {
  return {
    type: SET_TABLES,
    tables: tables
  };
};

export const getMenuDataByRestaurantKey = restaurantKey => {
  return async dispatch => {
    var numberOfItems = 0;
    menuRef.child(restaurantKey + "/numberOfElements").on("value", snapshot => {
      numberOfItems = snapshot.val();
    });
    menuRef.child(restaurantKey + "/items").on("value", snapshot => {
      let response = snapshot.val();
      let menu = [];
      for (let key in response) {
        menu.push({
          name: response[key].name,
          nameEN: response[key].nameEN ? response[key].nameEN : "",
          description: response[key].description,
          descriptionEN: response[key].descriptionEN ? response[key].descriptionEN : "",
          price: response[key].price,
          orderable: response[key].orderable ? true : false,
          categoryKey: response[key].categoryKey,
          locations: response[key].locations,
          pos: response[key].pos ? response[key].pos : 0,
          restaurantKey: response[key].restaurantKey,
          available: response[key].available ? true : false,
          bio: response[key].bio ? true : false,
          vegetarian: response[key].vegetarian ? true : false,
          vegan: response[key].vegan ? true : false,
          glutenFree: response[key].glutenFree ? true : false,
          frozen: response[key].frozen ? true : false,
          userKey: response[key].userKey,
          itemKey: response[key].itemKey,
          image: response[key].image ? response[key].image : "",
          allergeni: response[key].allergeni ? response[key].allergeni : "",
        });
      }
      dispatch(setMenuData(menu.reverse(), numberOfItems));
    });
    var numberOfCategories = 0;
    categoriesRef.child(restaurantKey + "/numberOfElements").once("value", snapshot => {
      numberOfCategories = snapshot.val();
    });
    categoriesRef.child(restaurantKey + "/categories").on("value", snapshot => {
      let categories = [];
      for (let key in snapshot.val()) {
        categories.push(snapshot.val()[key]);
      }
      categories.sort(function (a, b) {
        return a.pos - b.pos
      })
      dispatch(setCategoriesData(categories, numberOfCategories));
    });
  }
}
//Adesso nel beacon c e anche il locationKey, quindi usa quello per fetchare il menu, non il beacon key
//TODO: nel reducer metti anche il locationKey nel beacon
export const getLocationData = data => { // Da verificare
  return async dispatch => {
    locationsRef.child(data.restaurantKey + "/locations/" + data.locationKey).once("value").then(snapshot => {
      let parsedRes = snapshot.val();
      let location = {
        name: parsedRes.name,
        nameEN: parsedRes.nameEN ? parsedRes.nameEN : parsedRes.name,
        outdoor: (parsedRes.outdoor) ? true : false,
        restaurantKey: parsedRes.restaurantKey,
        description: parsedRes.description,
        descriptionEN: parsedRes.descriptionEN ? parsedRes.descriptionEN : parsedRes.description,
        userKey: parsedRes.userKey,
        locationKey: parsedRes.locationKey,
        beaconKeys: parsedRes.beaconKeys
      }
      /* for (let key in parsedRes.beaconKeys) {
         location.beaconKeys.push({
           [key]: true
         });
       }*/
      dispatch(setLocationData(location));
      //dispatch(getMenuDataByLocation(location));
    })
  }
}

export const setLocationData = location => {
  return {
    type: SET_LOCATION,
    location: location
  };
};



/* DA RIVEDERE
export const getMenuDataByLocation = data => {
  return async dispatch => {
    let categoryKeys = new Set();
    let sortedMenu = [];
    //vai a locationItem, fetcha tutti gli itemKey e poi con un for fetchali 
    locationItemRef.child(data.locationKey).once("value", snap => {
      let parsedRes = snap.val();
      //console.log(parsedRes);
      let menu = [];
      for (let key in parsedRes) {
        //console.log(key);
        menuRef.child(data.restaurantKey + "/items/" + key).once("value", snap => {
          let response = snap.val();
          //console.log(response);
          categoryKeys.add(response.categoryKey);
          menu.push({
            name: response.name,
            description: response.description,
            price: response.price,
            categoryKey: response.categoryKey,
            locations: response.locations,
            restaurantKey: response.restaurantKey,
            available: response.available,
            bio: response.bio ? true : false,
            vegetarian: response.vegetarian ? true : false,
            vegan: response.vegan ? true : false,
            glutenFree: response.glutenFree ? true : false,
            frozen: response.frozen ? true : false,
            userKey: response.userKey,
            itemKey: response.itemKey,
            image: response.image ? response.image : null,
          });
        });
      }

      let categories = [];

      for (let item of categoryKeys) {
        let response2 = [];
        let order = [];
        categoriesRef.child(data.restaurantKey + "/categories/" + item)
          .orderByKey()
          .once("value", snap => {
            response2 = snap.val();
          }).then(() => {
            catSortRef.child(response2.categoryKey).once("value", snap => {
              order = snap.val();
              categories.push({
                name: response2.name,
                description: response2.description,
                categoryKey: response2.categoryKey,
                restaurantKey: response2.restaurantKey,
                userKey: response2.userKey,
                order: order
              });
            }).then(() => {
              console.log(menu);
              for (let key in order) {
                console.log(order[key]);
                let item = menu.find(item => {
                  return item.itemKey === order[key]
                });
                console.log(item);
                sortedMenu.push(item);
              }
              console.log(sortedMenu);
            })
          });
      }
    }).then(() => {
      //console.log(menu);
      dispatch(setCategoriesData(categories.reverse(), 0));
      dispatch(setMenuData(menu.reverse(), 0));
      dispatch(getLocationData(data));
    });


  }
}
*/


export const getMenuDataByLocation = data => {
  return async dispatch => {
    let categoryKeys = new Set();
    let sortedMenu = [];
    //vai a locationItem, fetcha tutti gli itemKey e poi con un for fetchali 
    let locationItem = await locationItemRef.child(data.locationKey).once("value");
    let parsedRes = locationItem.val();
    console.log(parsedRes);
    let menu = [];
    for (let key in parsedRes) {
      console.log(key);
      let menuItem = await menuRef.child(data.restaurantKey + "/items/" + key).once("value");
      let response = menuItem.val();
      console.log(response);
      categoryKeys.add(response.categoryKey);
      menu.push({
        name: response.name,
        nameEN: response.nameEN,
        description: response.description,
        descriptionEN: response.descriptionEN,
        price: response.price,
        orderable: response.orderable ? true : false,
        categoryKey: response.categoryKey,
        locations: response.locations,
        restaurantKey: response.restaurantKey,
        available: response.available,
        pos: response.pos ? response.pos : 0,
        bio: response.bio ? true : false,
        vegetarian: response.vegetarian ? true : false,
        vegan: response.vegan ? true : false,
        glutenFree: response.glutenFree ? true : false,
        frozen: response.frozen ? true : false,
        userKey: response.userKey,
        itemKey: response.itemKey,
        image: response.image ? response.image : null,
        allergeni: response.allergeni ? response.allergeni : "",
      });
    }

    var numberOfCategories = 0;
    categoriesRef.child(data.restaurantKey + "/numberOfElements").once("value", snapshot => {
      numberOfCategories = snapshot.val();
    });
    let categories = [];
    categoriesRef.child(data.restaurantKey + "/categories").once("value", snapshot => {
      for (let key in snapshot.val()) {
        categories.push(snapshot.val()[key]);
      }
  console.log(categories);
    }).then(() => {
      categories.sort(function (a, b) {
        return a.pos - b.pos
      })
      dispatch(setCategoriesData(categories, numberOfCategories));
    });
    dispatch(setMenuData(menu, 0));
    dispatch(getLocationData(data));
  }
}



export const setMenuData = (menu, numberOfItems) => {
  return {
    type: SET_MENU,
    menu: menu,
    numberOfItems: numberOfItems ? numberOfItems : 0
  };
}

export const setCategoriesData = (categories, numberOfCategories) => {
  return {
    type: SET_CATEGORIES,
    categories: categories,
    numberOfCategories: numberOfCategories ? numberOfCategories : 0
  };
}

export const setRestaurantData = restaurant => {
  return {
    type: SET_RESTAURANT,
    restaurant: restaurant
  };
};

export const setNearestBeaconKeys = beaconKeys => {
  return {
    type: SET_NEAREST_BEACON_KEYS,
    beaconKeys: beaconKeys
  };
};

export const login = () => {
  return async dispatch => {
    try {
      Auth = await auth().signInAnonymously();
    } catch (e) {
      console.log(e.message);
    }
  }
}

export const goToMenu = () => {
  return dispatch => {
    Navigation.push("MyStack", {
      component: {
        name: 'RNFirebaseStarter.MenuScreen',
      }
    });
  }
}

export const goToSearchPage = () => {
  return dispatch => {
    Navigation.push("MyStack", {
      component: {
        name: 'RNFirebaseStarter.SearchScreen',
      }
    });
  }
}


export const verifyUser = () => {
  return async dispatch => {
    try {
      if (Auth) {
        await menuRef
          .once("value")
          .then(menuSnapshot => {
            console.log(menuSnapshot.val());
          });
      } else {
        console.log("user not signed");
      }
    } catch (e) {
      console.log(e.message);
    }
  };
}

export const loginRestaurant = (user, password) => {
  return async dispatch => {
    auth().signInWithEmailAndPassword(user, password)
      .then(authData => {
        Auth = authData.user;
        usersRef.child(Auth.uid + "/restaurantKey").once("value", snapshot => {
          restaurantKey = snapshot.val();
          console.log(restaurantKey);
        });
      })
      .catch(error => {
        console.log("Login Failed!", error);
      });
  }
}

export const setOrders = (orders, numberOfOrderedItems) => {
  return {
    type: SET_ORDERS,
    orders: orders,
    numberOfOrderedItems: numberOfOrderedItems
  };
};

export const updateOrder = (orders, table, comments, restaurantKey) => {
  return async dispatch => {
    if (Auth != null) {
      var myRef = ordersRef.child(restaurantKey + "/orders").push();
      var key = myRef.key;
      var newData = {
        restaurantKey: restaurantKey,
        //locationKey: locationKey,
        comments: comments,
        table: table,
        orders: orders,
        userKey: Auth.uid,
        datetime: Date.now(),
        orderKey: key,
        deleted: false,
        billed: false,
        locationKey: false
      }
      ordersRef.child(restaurantKey + "/orders/" + key).set(newData)
        .then(() => {
          ordersRef.child(
            restaurantKey + "/showOrders")
            .transaction(function (number) {
              number = number + 1;
              return number;
            });
        });
    } else {
      //inform user to login
    }
  }
}

export const searchRestaurant = (text) => {
  return async dispatch => {
    restaurantsRef.orderByChild('name')
      .startAt(text)
      .endAt(text + "\uf8ff")
      .once("value")
      .then(snapshot => {
        let parsedRes = snapshot.val();
        console.log(parsedRes);
        let searchResults = [];
        let number = 0;
        for (let key in parsedRes) {
          number++;
          searchResults.push({
            name: parsedRes[key].name,
            description: parsedRes[key].description,
            address: parsedRes[key].address,
            email: parsedRes[key].email,
            facebook: parsedRes[key].facebook,
            restaurantKey: parsedRes[key].restaurantKey
          })
        }
        dispatch(setRestaurantSearchResults(searchResults, number));
      })
  }
}

export const setRestaurantSearchResults = (results, number) => {
  return {
    type: SET_RESTAURANT_SEARCH_RESULTS,
    results: results,
    numberOfResults: number
  };
};

export const backToHome = (restaurantKey, componentId) => {
  return async dispatch => {
    tablesRef.child(restaurantKey + "/items").off("value");
    menuRef.child(restaurantKey + "/numberOfElements").off("value");
    menuRef.child(restaurantKey + "/items").orderByChild("items/position").off("value");
    categoriesRef.child(restaurantKey + "/numberOfElements").off("value");
    categoriesRef.child(restaurantKey + "/categories").orderByChild("categories/position").off("value");
    Navigation.pop(componentId);
    dispatch(resetRestaurantData());
  }
}

export const resetRestaurantData = () => {
  return {
    type: RESET_RESTAURANT_DATA
  };
};


export const getHistory = history => {
  return async dispatch => {
    let response = [];
    for (let key in history) {
      restaurantsRef.child(history[key])
        .once("value")
        .then(snapshot => {
          let parsedRes = snapshot.val();
          response.push(parsedRes);
          dispatch(setHistory(response));
        })
    }
  }
}

export const setHistory = history => {
  return {
    type: SET_HISTORY,
    history: history
  };
}

export const getNearRestaurantData = nearBeacons => {
  return async dispatch => {
    let response = [];
    for (let key in nearBeacons) {
      restaurantsRef.child(nearBeacons[key].restaurantKey)
        .once("value")
        .then(snapshot => {
          let parsedRes = snapshot.val();
          parsedRes.beacon = nearBeacons[key];
          response.push(parsedRes);
          dispatch(setNearRestaurants(response));
        })
    }
  }
}

export const setNearRestaurants = res => {
  return {
    type: SET_NEAR_RESTAURANTS,
    restaurants: res
  };
}