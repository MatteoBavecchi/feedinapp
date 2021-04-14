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
} from "../actions/actionTypes";

const initialState = {
  history: [],
  nearRestaurants: [],
  results: [],
  numberOfResults: 0,
  menu: [],
  numberOfItems: 0,
  categories: [],
  numberOfCategories: 0,
  tables: [],
  posts: [],
  restaurant: {
    popup: {
      image: "",
      text: "",
      title: "",
      visible: false
    },
    name: "",
    description: "",
    icon: "",
    cover: "",
    openStatus: false,
    userKey: "",
    info: "",
    restaurantKey: "",
    allowOrders: false,
    takeAway: false,
    delivery: false,
    allowLocations: false,
    facebook: "",
    instagram: "",
    website: "",
    openHours: [],
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
  nearBeaconsData: [],
  nearestBeaconData: {
    uuid: null,
    major: null,
    minor: null,
    proximity: '',
    beaconKey: '',
    restaurantKey: '',
    locationKey: '',
    locationName: ''
  },
  beaconsLoaded: false,
  locationLoaded: false,
  restaurantLoaded: false,
  menuLoaded: false,
  region: {
    identifier: "restaurantBeacon",
    uuid: "7005c5dc-4bc2-4164-b1ed-fc10fbb5c6af"
  },
  orders: [],
  numberOfOrderedItems: 0
};

const reducer = (state = initialState, action) => {

  switch (action.type) {
    case SET_RESTAURANT:
      return {
        ...state,
        restaurant: {
          ...state.restaurant,
          name: action.restaurant.name,
          description: action.restaurant.description,
          icon: action.restaurant.icon,
          cover: action.restaurant.cover,
          openStatus: action.restaurant.openStatus,
          userKey: action.restaurant.userKey,
          info: action.restaurant.info,
          restaurantKey: action.restaurant.restaurantKey,
          allowOrders: action.restaurant.allowOrders,
          allowLocations: action.restaurant.allowLocations,
          takeAway: action.restaurant.takeAway,
          delivery: action.restaurant.delivery,
          phone: action.restaurant.phone,
          facebook: action.restaurant.facebook,
          instagram: action.restaurant.instagram,
          website: action.restaurant.website,
          openHours: action.restaurant.openHours,
          address: {
            ...state.restaurant.address,
            street: action.restaurant.address.street,
            streetNumber: action.restaurant.address.streetNumber,
            city: action.restaurant.address.city,
            province: action.restaurant.address.province,
            cap: action.restaurant.address.cap
          },
          popup: action.restaurant.popup
        },
        restaurantLoaded: true,
      };
    case SET_NEAREST_BEACON_DATA:
      return {
        ...state,
        nearestBeaconData: {
          ...state.nearestBeaconData,
          uuid: action.beaconData.uuid,
          major: action.beaconData.major,
          minor: action.beaconData.minor,
          proximity: action.beaconData.proximity,
          distance: action.beaconData.distance,
          rssi: action.beaconData.rssi,
          restaurantKey: action.beaconData.restaurantKey,
          beaconKey: action.beaconData.beaconKey,
          locationKey: action.beaconData.locationKey,
          locationName: action.beaconData.locationName
        },
        beaconsLoaded: true
      }

    case SET_NEAR_BEACONS_DATA:
      const listOfTags = action.beaconsData.concat(state.nearBeaconsData),
        keys = ['major', 'minor'],
        filtered = listOfTags.filter((s => o => (k => !s.has(k) && s.add(k))
          (keys.map(k => o[k]).join('|')))(new Set)
        );
      return {
        ...state,
        nearBeaconsData: filtered
      }
    case SET_NEAREST_BEACON_KEYS:
      return {
        ...state,
        nearestBeaconData: {
          ...state.nearestBeaconData,
          beaconKey: action.beaconKeys.beaconKey,
          restaurantKey: action.beaconKeys.restaurantKey
        }
      }
    case SET_LOCATION:
      return {
        ...state,
        location: {
          ...state.location,
          name: action.location.name,
          nameEN: action.location.nameEN,
          outdoor: action.location.outdoor ? true : false,
          beaconKeys: action.location.beaconKeys,
          restaurantKey: action.location.restaurantKey,
          description: action.location.description,
          descriptionEN: action.location.descriptionEN,
          userKey: action.location.userKey,
          locationKey: action.location.locationKey
        },
        locationLoaded: true
      }
    case SET_MENU:
      return {
        ...state,
        menu: action.menu,
        numberOfItems: action.numberOfItems,
        menuLoaded: true
      }
    case SET_POSTS:
      return {
        ...state,
        posts: action.posts
      }
    case SET_CATEGORIES:
      return {
        ...state,
        categories: action.categories,
        numberOfCategories: action.numberOfCategories
      }
    case SET_TABLES:
      return {
        ...state,
        tables: action.tables
      }
    case SET_ORDERS:
      return {
        ...state,
        orders: action.orders,
        numberOfOrderedItems: action.numberOfOrderedItems
      }
    case SET_RESTAURANT_SEARCH_RESULTS:
      return {
        ...state,
        results: action.results,
        numberOfResults: action.numberOfResults
      }
    case RESET_RESTAURANT_DATA:
      return {
        ...state,
        menu: [],
        numberOfItems: 0,
        numberOfCategories: 0,
        categories: [],
        tables: [],
        restaurant: {
          name: "",
          description: "",
          icon: "",
          cover: "",
          openStatus: false,
          userKey: "",
          info: "",
          restaurantKey: "",
          allowOrders: false,
          allowLocations: false,
          takeAway: false,
          delivery: false,
          phone: "",
          facebook: "",
          instagram: "",
          website: "",
          openHours: [],
          address: {
            street: "",
            streetNumber: "",
            city: "",
            province: "",
            cap: ""
          },
          popup: {
            image: "",
            text: "",
            visible: false
          }
        },
        restaurantLoaded: false,
        menuLoaded: false,
        orders: [],
        numberOfOrderedItems: 0
      }
    case SET_HISTORY:
      return {
        ...state,
        history: action.history
      }
    case SET_NEAR_RESTAURANTS:
      return {
        ...state,
        nearRestaurants: action.restaurants
      }
    case RESET_BEACONS_DATA:
      return {
        ...state,
        nearBeaconsData: [],
        nearestBeaconData: {
          uuid: null,
          major: null,
          minor: null,
          proximity: '',
          beaconKey: '',
          restaurantKey: '',
          locationKey: '',
          locationName: ''
        },
        beaconsLoaded: false,
      }
    default:
      return state;
  }
};

export default reducer;
