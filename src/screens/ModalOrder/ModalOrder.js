import React from 'react';
import { StyleSheet, FlatList, Platform, NativeModules } from 'react-native';
import { connect } from "react-redux";
import {
    H3,
    Container,
    ListItem,
    Body,
    Text,
    Right,
    Content,
    Button,
    Header,
    Left,
    Icon,
    Title,
    Form,
    Textarea,
    Item,
    Input,
    Picker
} from 'native-base';
import { Navigation } from 'react-native-navigation';
import { updateOrder } from '../../store/actions/index'
import DeliverySelector from '../../components/DeliverySelector/DeliverySelector'
import ModalDelivery from "../../components/ModalDelivery/ModalDelivery"
import ModalTakeAway from "../../components/ModalTakeAway/ModalTakeAway"

const deviceLanguage =
    Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
        : NativeModules.I18nManager.localeIdentifier;

class ModalOrder extends React.Component {
    state = {
        region: {
            identifier: "restaurantBeacon",
            uuid: "7005c5dc-4bc2-4164-b1ed-fc10fbb5c6af"
        },
        table: "",
        comments: "",
        isSelectorModalVisible: false,
        isDeliveryModalVisible: false,
        isTakeAwayModalVisible: false,
    }

    constructor(props) {
        super(props);
    }

    toggleSelectorModal = () => {
        this.setState({ isSelectorModalVisible: !this.state.isSelectorModalVisible });
    };

    toggleDeliveryModal = () => {
        this.setState({ isDeliveryModalVisible: !this.state.isDeliveryModalVisible });
    };

    toggleTakeAwayModal = () => {
        this.setState({ isTakeAwayModalVisible: !this.state.isTakeAwayModalVisible });
    };

    delivery = () => {
        this.toggleSelectorModal();
        this.toggleDeliveryModal();
    }

    takeAway = () => {
        this.toggleSelectorModal();
        this.toggleTakeAwayModal();

    }
    navigationButtonPressed({ buttonId }) {
        if (buttonId === 'Cancel') {
            Navigation.dismissModal(this.props.componentId);
        }
    }

    handleSubmitButton = (orders) => {
        if (this.state.table == "") {
            alert(deviceLanguage == "it_IT" ?
                "Seleziona il tuo tavolo" :
                "Please, choose your table");
        }
        else {
            this.props.onUpdateOrder(
                orders,
                this.state.table,
                this.state.comments,
                //this.props.location.locationKey,
                this.props.restaurant.restaurantKey
            );
            alert(deviceLanguage == "it_IT" ?
                "Ordinazione effettuata!" :
                "Order made successfully!");
            Navigation.dismissAllModals();
        }
    }

    componentDidMount() {
        if (this.props.nearestRestaurantKey != this.props.restaurant.restaurantKey) {
            if (this.props.restaurant.takeAway && this.props.restaurant.delivery) {
                this.toggleSelectorModal();
            } else {
                if (this.props.restaurant.takeAway) {
                    this.toggleTakeAwayModal();
                } else {
                    if (this.props.restaurant.delivery) {
                        this.toggleDeliveryModal();
                    }
                }
            }
        }
    }

    render() {
        let insideForm = null;
        let footerButton = null;
        var tableList = [];
        let modal = null;
        let tables = this.props.tables;
        for (let key in tables) {
            tableList.push((
                <Picker.Item label={tables[key].name} value={tables[key].tableKey} />
            ));
        }

        if (this.props.nearestRestaurantKey == this.props.restaurant.restaurantKey) {
            insideForm = (
                <Content padder>
                    <Form>
                        <Item picker>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ width: undefined }}
                                placeholder={deviceLanguage == "it_IT" ?
                                    "Seleziona il tuo tavolo" :
                                    "Please, choose your table"}
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.table}
                                onValueChange={text => this.setState({
                                    ...this.state, table: text
                                })}
                            >
                                <Picker.Item label={deviceLanguage == "it_IT" ?
                                    "Seleziona il tuo tavolo" :
                                    "Please, choose your table"} value="NULL" />
                                {tableList}
                            </Picker>
                        </Item>
                        <Textarea
                            onChangeText={text => this.setState({
                                ...this.state, comments: text
                            })} rowSpan={5
                            } bordered
                            placeholder={deviceLanguage == "it_IT" ?
                                "Inserisci un commento" :
                                "Comments"}
                        />
                    </Form>
                </Content>
            );
            footerButton = (<Button rounded block
                onPress={() => { this.handleSubmitButton(newOrders) }}
                style={styles.confirmInsideButton}
            >
                <Text uppercase={false} style={styles.button}>
                    {deviceLanguage == "it_IT" ?
                        "Conferma" :
                        "Confirm"}
                </Text>
            </Button>);
        }


        let newOrders = this.props.orders.filter((item) => { return item.quantity > 0 });
        var ordersList = (
            <FlatList
                style={styles.flatList}
                data={newOrders}
                extraData={this.state}
                keyExtractor={item => item.itemKey}
                renderItem={item => {
                    let v = this.props.menu.filter((menu) => {
                        return menu.itemKey === item.item.itemKey
                    });
                    return (
                        <ListItem >
                            <Body style={styles.body}>
                                <Text><H3 style={styles.quantity}>{item.item.quantity}x    </H3>
                                    {deviceLanguage == "it_IT" ?
                                        v[0].name :
                                        v[0].nameEN ?
                                            v[0].nameEN :
                                            v[0].name}
                                </Text>
                            </Body>
                            <Right>
                                <Text>{v[0].price}€</Text>
                            </Right>
                        </ListItem>
                    )
                }}
            />
        );

        return (<Container>
            <Header style={{ backgroundColor: "#4bac61" }}
                androidStatusBarColor={"#4bac61"} hasTabs>
                <Left>
                    <Button transparent onPress={() => Navigation.dismissAllModals()}>
                        <Icon style={styles.drawerIcon} name='md-return-left' />
                    </Button>
                </Left>
                <Body style={{ flex: 3 }}>
                    <Title style={styles.title}>
                        {deviceLanguage == "it_IT" ?
                            "Riepilogo" :
                            "Make an order"}
                    </Title>
                </Body>
                <Right>
                </Right>
            </Header>
            <Content>{ordersList}</Content>
            {insideForm}
            {footerButton}

        </Container>);
    }
}

/*
<DeliverySelector
                isModalVisible={this.state.isSelectorModalVisible}
                delivery={() => this.delivery()}
                takeAway={() => this.takeAway()}
                toggleModal={() => this.toggleSelectorModal()}
            />
            <ModalDelivery
                isModalVisible={this.state.isDeliveryModalVisible}

                toggleModal={() => this.toggleDeliveryModal()}
            />
            <ModalTakeAway
                isModalVisible={this.state.isTakeAwayModalVisible}

                toggleModal={() => this.toggleTakeAwayModal()}
            />
*/
const styles = StyleSheet.create({
    quantity: {
        color: "#4bac61",
        fontWeight: "500"
    },
    listItem: {
        width: "100%",
        marginLeft: 0
    },
    listItemDisabled: {
        width: "100%",
        marginLeft: 0,
        opacity: 0.3
    },
    flatList: {
        marginBottom: 50,
        marginTop: "5%"
    },
    drawerIcon: {
        color: "#FFFFFF"
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
    confirmInsideButton: {
        position: 'absolute',
        bottom: 5,
        backgroundColor: '#51B869',
        justifyContent: 'center',
        width: "95%",
        alignSelf: "center"
    }
});

const mapStateToProps = state => {
    return {
        restaurant: state.restaurant.restaurant,
        menu: state.restaurant.menu,
        orders: state.restaurant.orders,
        tables: state.restaurant.tables,
        numberOfOrders: state.restaurant.numberOfOrders,
        nearestRestaurantKey: state.restaurant.nearestBeaconData.restaurantKey
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLoadBeaconsAndroid: region => dispatch(getBeaconDataAndroid(region)),
        onLoadBeaconsIos: region => dispatch(getBeaconDataIos(region)),
        stopLoadBeacons: region => dispatch(stopGetBeacons(region)),
        onLoadLocation: () => dispatch(getLocationDataByBeacon()),
        onFetchBeaconKeys: beaconData => dispatch(fetchBeaconKeys(beaconData)),
        onLogin: () => dispatch(login()),
        onUpdateOrder: (orders, table, comments, resKey) => dispatch(updateOrder(orders, table, comments, resKey))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalOrder);