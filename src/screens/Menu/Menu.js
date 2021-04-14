import React from "react";
import { View, StyleSheet, Platform, NativeModules } from 'react-native';

import { connect } from "react-redux";
import { Navigation } from "react-native-navigation";
import CategoryTab from "../../components/CategoryTab/CategoryTab";
import PrimaryTab from "../../components/PrimaryTab/PrimaryTab";
import ModalDetails from '../../components/ModalDetails/ModalDetails';
import WelcomeModal from '../../components/WelcomeModal/WelcomeModal';
import ModalOpenHours from "../../components/ModalOpenHours/ModalOpenHours";
import {
    setOrders,
    backToHome,
    getLastPosts,
    stopGetBeacons
} from "../../store/actions/index";
import Icon from 'react-native-vector-icons/FontAwesome5';

const deviceLanguage =
    Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
        : NativeModules.I18nManager.localeIdentifier;

import {
    Container,
    Header,
    Tab,
    Tabs,
    ScrollableTab,
    Text,
    Title,
    Button,
    Left,
    Right,
    Body,
    Drawer,
    Content,
    TabHeading
} from 'native-base';

class Menu extends React.Component {

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
        region: {
            identifier: "restaurantBeacon",
            uuid: "7005c5dc-4bc2-4164-b1ed-fc10fbb5c6af"
        },
        dataLoaded: false,
        orders: [],
        numberOfOrderedItems: 0,
        isModalVisible: false,
        isModalOpenHoursVisible: false,
        isWelcomeModalVisible: true,
        itemSelected: []
    }

    constructor(props) {
        super(props);

        console.log(deviceLanguage);
    }

    handleChangeOrder = (itemKey, value) => {
        let exist = false;
        for (let key in this.state.orders) {
            if (this.state.orders[key].itemKey === itemKey) {
                this.setState(prevState => {
                    var newOrders = prevState.orders;
                    var number = prevState.numberOfOrderedItems;
                    if (newOrders[key].quantity < value) {
                        number += value - newOrders[key].quantity;
                    }
                    else {
                        if (newOrders[key].quantity > value) {
                            number -= newOrders[key].quantity - value;
                        }
                    }
                    newOrders[key].quantity = value;
                    return {
                        ...prevState,
                        orders: newOrders,
                        numberOfOrderedItems: number
                    }
                });
                exist = true;
            }
        }
        if (!exist) {
            if (value) {
                this.setState(prevState => {
                    var newOrders = [];
                    var n = prevState.numberOfOrderedItems;
                    newOrders = prevState.orders;
                    newOrders.push({
                        itemKey: itemKey,
                        quantity: value
                    })
                    return {
                        ...prevState,
                        orders: newOrders,
                        numberOfOrderedItems: n + value
                    }
                });
            }
        }
    };

    handleSubmitButton = () => {
        this.props.onSetOrders(this.state.orders, this.state.numberOfOrderedItems);
        Navigation.showModal({
            stack: {
                children: [{
                    component: {
                        name: 'RNFirebaseStarter.ModalOrderScreen',
                        passProps: {
                            text: 'stack with one child'
                        },
                        options: {
                            topBar: {
                                visible: false,
                                height: 0,
                                animate: false
                            }
                        }
                    }
                }]
            }
        });
        this.setState({
            orders: [],
            numberOfOrderedItems: 0,
        });
    }

    handleBackButton = () => {
        this.props.onBackButton(this.props.restaurant.restaurantKey, this.props.componentId);
    }

    toggleModal = item => {
        this.setState({ isModalVisible: !this.state.isModalVisible, itemSelected: item });
    };

    toggleWelcomeModal = () => {
        this.setState({ isWelcomeModalVisible: !this.state.isWelcomeModalVisible });
    };

    toggleOpenHoursModal = () => {
        this.setState({ isModalOpenHoursVisible: !this.state.isModalOpenHoursVisible });
    };

    componentDidMount() {
        this.props.stopLoadBeacons(this.state.region);
    }

    render() {
        Navigation.mergeOptions(this.props.componentId, {
            topBar: {
                height: 0,
                visible: false
            }
        });

        var list = this.props.menu;
        var categories = [];
        categories = this.props.categories;
        var renderItem = [];
        var posts = this.props.posts;

        if (this.props.menuLoaded) {
            /////////////TAB PRINCIPALE DEL RISTORANTE 

            renderItem.push(
                <Tab
                    heading={<TabHeading style={{ backgroundColor: "#4bac61" }}>
                        <Icon style={styles.infoIcon} name="info-circle" />
                    </TabHeading>}
                    key={0}
                    tabStyle={{ backgroundColor: "#4bac61" }}
                    activeTabStyle={{ backgroundColor: "#4bac61" }}
                    textStyle={{ color: "#ffffff" }}
                    activeTextStyle={{ color: "#ffffff" }}
                >
                    <PrimaryTab
                        posts={this.props.posts}
                        openModal={() => this.toggleOpenHoursModal()}
                        restaurant={this.props.restaurant}
                        currentLocation={this.props.location.name ? this.props.location : null} />
                </Tab>
            );

            /////////////
            for (let key in categories) {
                if (categories[key].visible) {
                    let isEmpty = list.find(item => {
                        return item.categoryKey === categories[key].categoryKey
                    });
                    if (isEmpty !== undefined || categories[key].image) {
                        let itemsFiltered = list.filter(item => {
                            return item.categoryKey === categories[key].categoryKey
                        });
                        itemsFiltered.sort(function (a, b) {
                            return a.pos - b.pos
                        })
                        renderItem.push(
                            <Tab
                                key={categories[key].categoryKey}
                                heading={deviceLanguage == "it_IT" ?
                                    categories[key].name :
                                    categories[key].nameEN ?
                                        categories[key].nameEN :
                                        categories[key].name}
                                tabStyle={{ backgroundColor: "#4bac61" }}

                                activeTabStyle={{ backgroundColor: "#4bac61" }}
                                textStyle={{ color: "#ffffff" }}
                                activeTextStyle={{ color: "#ffffff" }}
                            >
                                <CategoryTab
                                    openModal={item => this.toggleModal(item)}
                                    orders={this.state.orders}
                                    numericPickerVisible={this.props.location.name &&
                                        this.props.location.restaurantKey == this.props.restaurant.restaurantKey ?
                                        this.props.restaurant.allowOrders : false}
                                    onChangeOrder={(itemKey, value) => this.handleChangeOrder(itemKey, value)}
                                    menu={itemsFiltered}
                                    category={categories[key]} />
                            </Tab>
                        );
                    }
                }
            }

            var submitButton = null;
            if (this.state.numberOfOrderedItems > 0) {
                submitButton = (
                    <Button rounded block
                        onPress={() => this.handleSubmitButton()}
                        style={{
                            position: 'absolute',
                            bottom: 5,
                            backgroundColor: '#51B869',
                            justifyContent: 'center',
                            width: "95%",
                            alignSelf: "center"
                        }}
                    >
                        <Text uppercase={false} style={styles.button}>
                            {deviceLanguage == "it_IT" ? "Ordina i piatti selezionati" : "Order the selected items"}
                        </Text>
                    </Button>
                );
            }
            else {
                submitButton = null;
            }

            var locationBadge = this.props.location.name &&
                this.props.location.restaurantKey == this.props.restaurant.restaurantKey ? (
                    <Text style={styles.location}> {deviceLanguage == "it_IT" ?
                        this.props.location.name :
                        this.props.location.nameEN ?
                            this.props.location.nameEN :
                            this.props.location.name}
                    </Text>
                ) : null;
            return (
                <Container >
                    <Header style={{ backgroundColor: "#4bac61" }}
                        androidStatusBarColor={"#357844"} hasTabs>
                        <Left>
                            <Button transparent onPress={() => this.handleBackButton()}>
                                <Icon style={styles.drawerIcon} name='arrow-left' />
                            </Button>
                        </Left>
                        <Body style={{ flex: 3 }}>
                            <Title style={styles.title}>
                                {this.props.restaurant.name}
                            </Title>
                        </Body>
                        <Right>
                            {locationBadge}
                        </Right>
                    </Header>
                    {this.props.categories.length > 0 &&
                        <Tabs tabBarUnderlineStyle={styles.tabs}
                            ref={t => this._tabs = t}
                            renderTabBar={() =>
                                <ScrollableTab style={{ backgroundColor: "#4bac61" }} />
                            }
                        >
                            {renderItem}
                        </Tabs>
                    }
                    {submitButton}
                    {(this.props.popup) ? (this.props.popup.visible) ? (<WelcomeModal
                        image={this.props.popup.image}
                        title={this.props.popup.title}
                        text={this.props.popup.text}
                        isModalVisible={this.state.isWelcomeModalVisible}
                        toggleModal={() => this.toggleWelcomeModal()} />) : null : null}
                    <ModalDetails
                        isModalVisible={this.state.isModalVisible}
                        toggleModal={() => this.toggleModal()}
                        itemSelected={this.state.itemSelected} />
                    <ModalOpenHours
                        isModalVisible={this.state.isModalOpenHoursVisible}
                        toggleModal={() => this.toggleOpenHoursModal()}
                        item={this.props.restaurant.openHours} />
                </Container>

            );
        }
        else {
            return null;
        }
    }
};

const mapStateToProps = state => {
    return {
        posts: state.restaurant.posts,
        popup: state.restaurant.restaurant.popup,
        restaurant: state.restaurant.restaurant,
        location: state.restaurant.location,
        menu: state.restaurant.menu,
        categories: state.restaurant.categories,
        menuLoaded: state.restaurant.menuLoaded,
        orders: state.restaurant.orders
    };
};

const mapDispatchToProps = dispatch => {
    return {
        stopLoadBeacons: region => dispatch(stopGetBeacons(region)),
        onSetOrders: (orders, numberOfOrderedItems) => dispatch(setOrders(orders, numberOfOrderedItems)),
        onBackButton: (restaurantKey, componentId) => dispatch(backToHome(restaurantKey, componentId)),
        onGetLastPosts: restaurantKey => dispatch(getLastPosts(restaurantKey))
    };
};

const styles = StyleSheet.create({
    drawerIcon: {
        color: "#FFFFFF",
        fontSize: 28
    },
    tabs: {
        backgroundColor: "#FFFFFF"
    },
    title: {
        fontWeight: "500",
        fontSize: 22,
        alignSelf: "center",
        color: "#FFFFFF"
    },
    button: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "500"
    },
    infoIcon: {
        color: "#fff",
        fontSize: 20
    },
    location: {
        fontWeight: "400",
        fontSize: 16,
        color: "#ffc107",
        //alignSelf: "center",
        borderColor: "#ffc107",
        borderWidth: 1.5,
        borderRadius: 3
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);