import {
  SET_RESTAURANT_ADMIN,
  SET_ORDERS_ADMIN,
  SET_LOCATION_ADMIN,
  SET_CATEGORIES_ADMIN,
  SET_MENU_ADMIN,
  SET_TABLES_ADMIN
} from "../actions/actionTypes";

const initialState = {
  menu: [],
  numberOfItems: 0,
  categories: [],
  numberOfCategories: 0,
  restaurant: {
    name: "",
    description: "",
    logo: "",
    openStatus: false,
    userKey: "",
    restaurantKey: "",
    allowOrders: false,
    allowLocations: false,
    address: {
      street: "",
      streetNumber: "",
      city: "",
      province: "",
      cap: ""
    }
  },
  location: {
    name: "",
    outdoor: false,
    beaconKeys: [],
    restaurantKey: "",
    description: "",
    userKey: "",
    locationKey: ""
  },
  region: {
    identifier: "restaurantBeacon",
    uuid: "7005c5dc-4bc2-4164-b1ed-fc10fbb5c6af"
  },
  orders: [],
  ordersTrash: [],
  tables: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_RESTAURANT_ADMIN:
      return {
        ...state,
        restaurant: {
          ...state.restaurant,
          name: action.restaurant.name,
          description: action.restaurant.description,
          //logo: action.restaurant.logo,
          //openStatus: action.restaurant.openStatus,
          userKey: action.restaurant.userKey,
          restaurantKey: action.restaurant.restaurantKey,
          allowOrders: action.restaurant.allowOrders,
          allowLocations: action.restaurant.allowLocations,
          address: {
            ...state.restaurant.address,
            street: action.restaurant.address.street,
            streetNumber: action.restaurant.address.streetNumber,
            city: action.restaurant.address.city,
            province: action.restaurant.address.province,
            cap: action.restaurant.address.cap
          }
        },
        restaurantLoaded: true,
      };
    case SET_LOCATION_ADMIN:
      return {
        ...state,
        location: {
          ...state.location,
          name: action.location.name,
          outdoor: action.location.outdoor ? true : false,
          beaconKeys: action.location.beaconKeys,
          restaurantKey: action.location.restaurantKey,
          description: action.location.description,
          userKey: action.location.userKey,
          locationKey: action.location.locationKey
        },
        locationLoaded: true
      }
    case SET_MENU_ADMIN:
      return {
        ...state,
        menu: action.menu,
        numberOfItems: action.numberOfItems,
        menuLoaded: true
      }
    case SET_CATEGORIES_ADMIN:
      return {
        ...state,
        categories: action.categories,
        numberOfCategories: action.numberOfCategories
      }
    case SET_ORDERS_ADMIN:
      return {
        ...state,
        orders: action.orders
      }
    case SET_TABLES_ADMIN:
      return {
        ...state,
        tables: action.tables
      }
    default:
      return state;
  }
};

export default reducer;
