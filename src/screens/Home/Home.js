import React from 'react';
import {
  Text,
  View,
  Platform,
  PermissionsAndroid,
  Alert,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  NativeModules,
  Image
} from 'react-native';
import Modal from "react-native-modal";

import SystemSetting from 'react-native-system-setting';
import {
  getBeaconDataIos,
  getBeaconDataAndroid,
  stopGetBeacons,
  getLocationDataByBeacon,
  fetchBeaconKeys,
  login,
  goToSearchPage,
  getHistory,
  getRestaurantData,
  clearBeaconList,
  startMonitoringIos,
  startMonitoringAndroid,
  stopRangingIos,
  stopRangingAndroid
} from "../../store/actions/index"
import { Navigation } from "react-native-navigation";
import { connect } from "react-redux";
import { BluetoothStatus } from 'react-native-bluetooth-status';
import SideBar from '../../components/SideBar/SideBar';
import AsyncStorage from '@react-native-community/async-storage';
import {
  H1,
  Container,
  Header,
  Left,
  Button,
  Body,
  Right,
  Title,
  Drawer,
  Item,
  ListItem,
  Content,
  Thumbnail,
  Footer,
  FooterTab,
  Badge,
  Fab
} from 'native-base';

import Icon from "react-native-vector-icons/FontAwesome5";
import PushNotification from "react-native-push-notification";
import analytics from '@react-native-firebase/analytics';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import messaging from '@react-native-firebase/messaging';
import AppIntroSlider from 'react-native-app-intro-slider';

const slides = [
  {
    key: 'one',
    title: 'Tutti i menù\ndei tuoi ristoranti preferiti\n\nIn un\'unica app\nSemplice e veloce',
    text: 'Il tuo ristorante\nin tasca',
    text2: 'Leggi i menù dei tuoi ristoranti preferiti con FeedInApp ',
    icon: "utensils",
    bg: '#86F7A0',
  },
  {
    key: 'two',
    title: 'Entra nel ristorante\ncon il Bluetooth attivo\n\nLeggi il menù\n\nNon serve altro',
    text: 'Other cool stuff',
    icon: "compass",
    bg: '#AB4B54',
  },
  {
    key: 'three',
    title: 'Oppure scansiona il codice QR',
    text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
    icon: "qrcode",
    bg: '#22bcb5',
  }
];

const ListenApp = props => {
  React.useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      let data = {
        restaurantKey: remoteMessage.data.restaurantKey
      };
      //props.onStopLoadBeacons();
      props.onGetRestaurantData(data);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          let data = {
            restaurantKey: remoteMessage.data.restaurantKey
          };
          //props.onStopLoadBeacons();
          props.onGetRestaurantData(data);
        }
      });

    dynamicLinks()
      .getInitialLink()
      .then(link => {
        console.log(link);
        if (link !== null) {
          console.log(link.url);
          var str = link.url;
          var res = str.split("https://feedinapp.com?r=");
          let data = {
            restaurantKey: res[1]
          };
          //props.onStopLoadBeacons();
          props.onGetRestaurantData(data);
        }
      });
  }, []);

  return null;
}

const deviceLanguage =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale ||
    NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
    : NativeModules.I18nManager.localeIdentifier;

let refreshButton = null;
let spinner = true;
class Home extends React.Component {
  static get options() {
    return {
      topBar: {
        visible: false,
        animate: false,
        height: 0,
      }
    };
  }
  state = {
    isProgress: false,
    firstLaunch: null,
    rangingDataSource: [],
    history: [],
    isLoading: true,
    region: {
      identifier: "restaurantBeacon",
      uuid: "7005c5dc-4bc2-4164-b1ed-fc10fbb5c6af"
    },
    FabActive: true
  }

  constructor(props) {
    super(props);
  }

  closeDrawer = () => {
    this.drawer._root.close()
  };
  openDrawer = () => {
    this.drawer._root.open()
  };

  toggleProgressbar = () => {
    this.state.isProgress ? this.setState({ isProgress: false }) : this.setState({ isProgress: true })
  }

  async checkBluetooth() {
    try {
      const isEnabled = await BluetoothStatus.state();
      if (!isEnabled) {
        if (Platform.OS === 'ios') {
          Alert.alert('Il bluetooth non è attivo', 'Il bluetooth serve per trovare ristoranti nelle vicinanze,' +
            'ti consigliamo di attivarlo. Potrai comunque cercare manualmente il ristorante, digitandolo nella barra di ricerca.',
            [{ text: 'Ok', onPress: () => { } }]
          );
          this.props.stopLoadBeacons(this.state.region);
          spinner = false;
        }
        else {
          BluetoothStatus.enable(true);
        }
      } else {
        spinner = true;
      }
    } catch (error) { console.error(error); }
  }

  async requestBLPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permesso ',
          message:
            'Serve il tuo permesso per far funzionare' +
            'al meglio FeedInApp',
          buttonNeutral: 'più tardi',
          buttonNegative: 'Non voglio',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Puoi usare ACCESS_COARSE_LOCATION');
        this.searchBeacons();
      } else {
        console.log('ACCESS_FINE_LOCATION denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  testPush = () => {
    PushNotification.localNotification({
      title: "La mia prima notifica", // (optional)
      message: "Ciao che bella cosa", // (required)
      playSound: true // (optional) default: true
    });
    PushNotification.localNotificationSchedule({
      //... You can use all the options from localNotifications
      message: "Questa è una notifica pianificata", // (required)
      date: new Date(Date.now() + 10 * 1000), // in 60 secs
      allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
    });
  }



  async searchBeacons() {
    // this.testPush();
    // this.event();
    this.props.clearBeaconList();
    if (Platform.OS === 'ios') {
      this.checkBluetooth().then(() => {

        this.props.onLoadBeaconsIos(this.state.region);
      });
    }
    else {
      SystemSetting.isLocationEnabled().then((enable) => {
        if (!enable) {
          Alert.alert(
            "Localizzazione",
            "Per utilizzare correttamente FeedInApp, attiva la localizzazione",
            [

              {
                text: "Non ora",
                onPress: () => this.props.stopLoadBeacons(this.state.region),
                style: "cancel"
              },
              {
                text: "Attiva",
                onPress: () => SystemSetting.switchLocation(() => {
                  console.log('switch location successfully');
                })
              }
            ],
            { cancelable: false }
          );

        }
      })
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(permission => {
        if (permission) {
          this.checkBluetooth().then(() => {
            this.props.onLoadBeaconsAndroid(this.state.region);
          });
        }
        else {
          this.requestBLPermission();
        }
      })

    }
  }

  async event() {
    await analytics().logEvent('prova')
  }


  componentWillUnMount() {
    if (Platform.OS === 'ios') {
      this.props.onStopRangingIos(this.state.region);
    } else {
      this.props.onStopRangingAndroid(this.state.region);
    }
  }

  componentDidUpdate(prevState) {
    if ((this.props.restaurants.beaconsLoaded) &
      (this.props.restaurants.nearestBeaconData.major !==
        prevState.restaurants.nearestBeaconData.major ||
        this.props.restaurants.nearestBeaconData.minor !==
        prevState.restaurants.nearestBeaconData.minor)) {
      this.props.stopLoadBeacons(this.state.region);
      this.handleGetRestaurantData(this.props.restaurants.nearestBeaconData)
    }
  }

  handleSearchButton = () => {
    this.props.onGoToSearchPage();
  }

  enableBL = () => {
    alert("attivalo!");
  }

  handleGetRestaurantData = (restaurantKey, beaconKey) => {
    this.props.onGetRestaurantData(restaurantKey, beaconKey);
  }

  async componentWillMount() {
    await this.props.onLogin();
  }
  componentDidMount() {
    AsyncStorage.getItem("alreadyLaunched").then(value => {
      if (value == null) {
        AsyncStorage.setItem('alreadyLaunched', JSON.stringify(true)); // No need to wait for `setItem` to finish, although you might want to handle errors
        this.setState({ firstLaunch: true });
      }
      else {
        this.setState({ firstLaunch: false });
      }
    }) // Add some error handling, also you can simply do this.setState({fistLaunch: value == null})

    //this.searchBeacons();
    this.toggleProgressbar();
    let that = this;
    setTimeout(function () {
      that.setState({ isProgress: false })
      let data = {
        restaurantKey: "-METR84BH52iJegO4Ous"
      };
      that.handleGetRestaurantData(data)
    }, 2500);
    AsyncStorage.getItem('@restaurant_History').then(history => {
      this.setState({
        isLoading: false,
        history: JSON.parse(history)
      });
      this.props.onGetHistory(JSON.parse(history));
    });
  }

  goToQR = () => {
    Navigation.push("MyStack", {
      component: {
        name: 'RNFirebaseStarter.QRScreen',
        options: {
          animations: {
            push: {
              enabled: false
            }
          }
        }
      }
    })
  }

  _renderItem = ({ item }) => {
    return (
      <View style={{
        flex: 1,
        // alignItems: "flex-start",
        //justifyContent: "center",
        backgroundColor: item.bg
      }}>
        <Text style={styles.slideTitle}>{item.title}</Text>

        <View style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "flex-end",
        }}>
          <Icon style={styles.slideImage} name={item.icon} />
        </View>

      </View>
    );
  }

  _onDone = () => {
    this.setState({ firstLaunch: false });
  }


  render() {

    if (this.state.firstLaunch === null) {
      return null; // This is the 'tricky' part: The query to AsyncStorage is not finished, but we have to present something to the user. Null will just render nothing, so you can also put a placeholder of some sort, but effectively the interval between the first mount and AsyncStorage retrieving your data won't be noticeable to the user.
    }
    else if (this.state.firstLaunch == true) {
      return <AppIntroSlider
        showSkipButton={true}
        showPrevButton={true}
        skipLabel="Salta"
        prevLabel="Indietro"
        doneLabel="Finito"
        nextLabel="Avanti"
        renderItem={this._renderItem}
        data={slides}
        onDone={this._onDone}
      />
    }
    else {



      let near = null;
      let items = (<Title style={styles.logo}>
        {deviceLanguage == "it_IT" ?
          "Nessun ristorante visitato recentemente" :
          "No recent restaurants"}
      </Title>);
      let history = this.props.history;
      let nearRestaurants = this.props.nearRestaurants;
      if (!this.state.isLoading) {
        items = (
          <FlatList
            style={styles.flatList}
            data={history}
            keyExtractor={item => item.restaurantKey}
            renderItem={item => {
              return (

                <ListItem avatar style={styles.listItem}>
                  <Left>
                    <TouchableOpacity onPress={() => {
                      let data = {
                        restaurantKey: item.item.restaurantKey
                      };
                      this.props.stopLoadBeacons(this.state.region)
                      this.handleGetRestaurantData(data)
                    }
                    }
                    >
                      <Thumbnail style={styles.avatar} source={{ uri: item.item.icon }} />
                    </TouchableOpacity>
                  </Left>
                  <Body>
                    <TouchableOpacity onPress={() => {
                      let data = {
                        restaurantKey: item.item.restaurantKey
                      };
                      this.props.stopLoadBeacons(this.state.region)
                      this.handleGetRestaurantData(data)
                    }
                    }
                    >
                      <Text style={styles.name}>{item.item.name + "  "}
                      </Text>
                      <Text note>{item.item.address.city +
                        " - " + item.item.address.street +
                        ", " + item.item.address.streetNumber
                      }
                      </Text>
                    </TouchableOpacity>
                  </Body>
                  <Right>
                    <TouchableOpacity >
                      <Icon
                        type="FontAwesome"
                        name="star"
                        style={styles.plusIcon}
                      />
                    </TouchableOpacity>
                  </Right>
                </ListItem>
              );
            }}
          />
        )
      }
      else {
        items = (<Title style={styles.logo}>{deviceLanguage == "it_IT" ?
          "Nessun ristorante visitato recentemente" :
          "No recent restaurants"}</Title>);
      }

      if (this.props.isLoadingBeacons) {
        refreshButton = spinner ? (<Button transparent onPress={() => this.props.stopLoadBeacons(this.state.region)}>
          <ActivityIndicator size="large" color="#fff" />
        </Button>) : (<Button transparent onPress={() => this.searchBeacons()}>
          <Icon style={styles.burger} name='redo' />
        </Button>);

      } else {

        refreshButton = (<Button transparent onPress={() => this.searchBeacons()}>
          <Icon style={styles.burger} name='redo' />
        </Button>)
      }

      if (nearRestaurants == null) {
        near = spinner ? <ActivityIndicator size="large" color="#000" /> : null;
      }
      else {
        near = (
          <FlatList
            style={styles.flatList}
            data={nearRestaurants}
            keyExtractor={item => item.beacon.beaconKey}
            renderItem={item => {

              var locationBadge = (
                <Text style={styles.location}> {
                  item.item.beacon.locationName
                }
                </Text>
              );
              return (
                <ListItem avatar style={styles.listItem}>
                  <Left>
                    <TouchableOpacity onPress={() => {
                      let data = {
                        restaurantKey: item.item.restaurantKey,
                        locationKey: item.item.beacon.locationKey
                      };
                      this.props.stopLoadBeacons(this.state.region)
                      this.handleGetRestaurantData(data)
                    }
                    }
                    >
                      <Thumbnail style={styles.avatar} source={{ uri: item.item.icon }} />
                    </TouchableOpacity>
                  </Left>
                  <Body>
                    <TouchableOpacity onPress={() => {
                      let data = {
                        restaurantKey: item.item.restaurantKey,
                        locationKey: item.item.beacon.locationKey
                      };
                      this.props.stopLoadBeacons(this.state.region)
                      this.handleGetRestaurantData(data)
                    }
                    }
                    >
                      <Text style={styles.name}>{item.item.name + "  "}
                      </Text>
                      <Text note>{item.item.address.city +
                        " - " + item.item.address.street +
                        ", " + item.item.address.streetNumber
                      }
                      </Text>
                    </TouchableOpacity>
                  </Body>
                  <Right>
                    {locationBadge}
                  </Right>
                </ListItem>
              );
            }}
          />
        )
      }
      return (

        <Drawer
          ref={(ref) => { this.drawer = ref; }}
          content={<SideBar />}
          onClose={() => this.closeDrawer()}
        >
          <Container style={styles.container}>

            <ListenApp
              onStopLoadBeacons={() => this.props.stopLoadBeacons(this.state.region)}
              onGetRestaurantData={data => this.handleGetRestaurantData(data)} />
            <Header searchBar rounded style={{ backgroundColor: "#4bac61", height: 62 }}
              androidStatusBarColor={"#357844"}>
              <Left style={{ flex: null }}>
                <Button transparent onPress={() => this.openDrawer()}>
                  <Icon style={styles.burger} name='bars' />
                </Button>
              </Left>
              <Body><Text style={styles.title}>FeedInApp</Text></Body>
              <Right>
                {refreshButton}
                <Button transparent onPress={() => this.handleSearchButton()}>
                  <Icon style={styles.burger} name='search' />
                </Button>
              </Right>


            </Header>
            <CustomProgressBar visible={this.state.isProgress} />
            <H1 style={styles.near}>{deviceLanguage == "it_IT" ?
              "Nelle vicinanze" :
              "Nearby"}</H1>
            {near}
            <H1 style={styles.history}>{deviceLanguage == "it_IT" ?
              "Recenti" :
              "History"}</H1>
            {items}




            <TouchableOpacity
              onPress={() => this.goToQR()}
              style={styles.fab}
            >
              <Icon style={styles.fabIcon} name="qrcode" size={28} color="#4bac61" />
              <Text style={styles.fabText}>Codice QR</Text>
            </TouchableOpacity>

          </Container>
        </Drawer>

      );
    }
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2"
  },
  logo: {
    flex: 1,
    textAlign: 'center',
    width: "100%",
    textAlignVertical: "center",
    alignSelf: "center",
    fontSize: 18,
    color: "#ccc",
    fontWeight: "400",
    opacity: 1
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#FFFFFF",
    marginLeft: 14
  },
  sideBarMenu: {
    marginLeft: 16,
    marginRight: 4
  },
  burger: {
    fontSize: 28,
    color: "#fff"
  },
  alert: {
    fontSize: 36,
    color: "#f00"
  },
  history: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 23,
    paddingTop: 24,
    paddingLeft: 16,
  },
  near: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 23,
    paddingTop: 24,
    paddingLeft: 16,
  },
  listItem: {
    alignSelf: "center",
    width: "96%",
  },
  flatList: {
    marginBottom: 50
  },
  name: {
    fontSize: 18,
    color: "#000"
  },
  avatar: {
    width: 54,
    height: 54
  },
  location: {
    fontWeight: "400",
    fontSize: 16,
    color: "#ffc107",
    //alignSelf: "center",
    borderColor: "#ffc107",
    borderWidth: 1.5,
    borderRadius: 3
  },
  footerContainer: {
    height: 66
  },
  footer: {
    backgroundColor: "#fff"
  },
  homeIcon: {

    fontSize: 26,
    color: "#4bac61"
  },
  qrcodeIcon: {

    fontSize: 26,
    color: "#4bac61"
  },
  homeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4bac61"
  },
  qrcodeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4bac61"
  },
  homeButton: {

  },
  qrcodeButton: {
    opacity: 0.4
  },
  fabText: {
    paddingTop: 14,
    paddingBottom: 14,
    paddingRight: 20,
    paddingLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#4bac61"
  },
  fab: {
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 3, // Android
    flexDirection: "row",
    borderWidth: 1,
    borderColor: '#4bac61',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    right: 20,
    //height: 70,
    backgroundColor: '#fff',
    borderRadius: 80,
  },
  fabIcon: {
    paddingLeft: 20
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4bac61',
  },
  slideImage: {
    fontSize: 180,

  },
  slideText: {
    fontSize: 22,
    fontWeight: "normal",
    color: '#4bac61',
    textAlign: 'center',
  },
  slideTitle: {
    paddingTop: 100,
    padding: 10,
    fontSize: 36,
    fontWeight: "bold"
    //textAlign: 'center',
  },
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  }
});



const mapStateToProps = state => {
  return {
    restaurants: state.restaurant,
    history: state.restaurant.history,
    nearRestaurants: state.restaurant.nearRestaurants,
    isLoadingBeacons: state.ui.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onStopRangingIos: region => dispatch(stopRangingIos(region)),
    onStopRangingAndroid: region => dispatch(stopRangingAndroid(region)),
    onStartMonitoringIos: region => dispatch(startMonitoringIos(region)),
    onStartMonitoringAndroid: region => dispatch(startMonitoringAndroid(region)),
    onLoadBeaconsAndroid: region => dispatch(getBeaconDataAndroid(region)),
    onLoadBeaconsIos: region => dispatch(getBeaconDataIos(region)),
    stopLoadBeacons: region => dispatch(stopGetBeacons(region)),
    onLoadLocation: () => dispatch(getLocationDataByBeacon()),
    onLogin: () => dispatch(login()),
    onGoToSearchPage: () => dispatch(goToSearchPage()),
    onGetHistory: history => dispatch(getHistory(history)),
    onGetRestaurantData: (data) => dispatch(getRestaurantData(data)),
    clearBeaconList: () => dispatch(clearBeaconList())
  };
};

const CustomProgressBar = ({ visible }) => (
  <Modal
    testID={'modal'}
    isVisible={visible}
    onSwipeComplete={() => this.toggleProgressbar()}
    swipeDirection={['up', 'left', 'right', 'down']}
    style={styles.view}>

    <View style={{
      backgroundColor: 'white',
      padding: 22,
      paddingBottom: 100,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    }}>
      <Text style={{ fontSize: 24, fontWeight: '200', marginBottom: 20 }}>Sto cercando ristoranti nelle vicinanze...</Text>
      <ActivityIndicator size="large" />
    </View>

  </Modal>
);
export default connect(mapStateToProps, mapDispatchToProps)(Home);

