import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View } from 'react-native';
import {
    getBeaconDataIos,
    getBeaconDataAndroid,
    stopGetBeacons,
    getLocationDataByBeacon,
    fetchBeaconKeys,
    login,
    deleteOrder
} from "../../store/actions/index"
import { connect } from "react-redux";
import SideBar from '../../components/SideBar/SideBar';
import {
    Container,
    Header,
    Icon,
    Text,
    Title,
    Button,
    Left,
    Right,
    Body,
    Drawer,
    Content,
    Card,
    CardItem,

} from 'native-base';

class Comande extends React.Component {
    state = {
        region: {
            identifier: "restaurantBeacon",
            uuid: "7005c5dc-4bc2-4164-b1ed-fc10fbb5c6af"
        }
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

    render() {
        var orderCards = [];
        let orders = this.props.orders.filter((order) => {
            return order.deleted === false
        })
        let orderList = (
            <FlatList
                //style={styles.flatList}
                data={orders}
                //extraData={this.state}
                keyExtractor={item => item.orderKey}
                renderItem={item => {
                    let items = [];
                    let ordersList = item.item.orders

                    for (let key in ordersList) {
                        let i = this.props.menu.filter((menu) => {
                            return menu.itemKey === ordersList[key].itemKey
                        });

                        items.push(
                            <Content style={styles.containerItems}>
                                <Text><Text style={styles.quantity}>{ordersList[key].quantity}x </Text>
                                    <Text style={styles.name}> {i[0].name} </Text>
                                </Text>
                            </Content>
                        );

                    }
                    let tableName = this.props.tables.find((table) => {
                        return table.tableKey === item.item.table;
                    });

                    console.log(tableName.name);

                    return (
                        <Card style={styles.card}>
                            <CardItem header bordered style={styles.cardItem}>
                                <Title style={styles.tableText}>Tavolo {tableName.name}</Title>
                                <Content>
                                    <TouchableOpacity onPress={() => this.props.onDeleteOrder(this.props.restaurant.restaurantKey, item.item.orderKey)}>
                                        <Icon style={styles.closeIcon} name='close' />
                                    </TouchableOpacity>
                                </Content>

                            </CardItem>
                            <CardItem >
                                <Body>
                                    {items}
                                </Body>
                            </CardItem>
                            <CardItem>
                                <Body>
                                    <Text style={styles.comments}>Commenti:</Text>
                                    <Text style={styles.textComments}>{item.item.comments}</Text>
                                </Body>
                            </CardItem>
                            <CardItem footer>
                            </CardItem>
                        </Card>
                    )
                }
                }
            />
        );
        return (
            <Drawer
                ref={(ref) => { this.drawer = ref; }}
                content={< SideBar />}
                onClose={() => this.closeDrawer()}
            >
                <Container>
                    <Header style={{ backgroundColor: "#4bac61" }}
                        androidStatusBarColor={"#4bac61"} hasTabs>
                        <Left>
                            <Button transparent onPress={() => this.openDrawer()}>
                                <Icon style={styles.drawerIcon} name='menu' />
                            </Button>
                        </Left>
                        <Body style={{ flex: 3 }}>
                            <Title style={styles.title}>
                                Comande - {this.props.restaurant.name}
                            </Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <Content>{orderList}</Content>
                </Container>
            </Drawer >
        );
    }
}
const styles = StyleSheet.create({
    quantity: {
        color: '#4bac61',
        fontWeight: "500"
    },
    name: {
        color: "#A9A9A9",
    },
    closeIcon: {
        alignSelf: "flex-end",
        color: "#cecece",

    },
    textComments: {
        color: "#A9A9A9",
        fontSize: 14
    },
    comments: {
        color: "#A9A9A9",
    },
    itemText: {
        color: "#A9A9A9",
    },
    tableText: {
        color: '#4bac61',
        fontWeight: "500"
    },
    card: {
        width: "94%",
        alignSelf: "center",

    },
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "space-between"
    },
    logo: {
        flex: 1,
        textAlign: 'center',
        width: "100%",
        textAlignVertical: "center",
        alignSelf: "center",
        fontSize: 50,
        color: "#4bac61",
        fontWeight: "900"
    },
    drawerIcon: {
        color: "#FFFFFF"
    },
    title: {
        fontWeight: "500",
        fontSize: 20,
        alignSelf: "center",
        color: "#FFFFFF"
    }
});
const mapStateToProps = state => {
    return {
        orders: state.restaurantAdmin.orders,
        tables: state.restaurantAdmin.tables,
        menu: state.restaurantAdmin.menu,
        restaurant: state.restaurantAdmin.restaurant
    }
};
const mapDispatchToProps = dispatch => {
    return {
        onLoadBeaconsAndroid: region => dispatch(getBeaconDataAndroid(region)),
        onLoadBeaconsIos: region => dispatch(getBeaconDataIos(region)),
        stopLoadBeacons: region => dispatch(stopGetBeacons(region)),
        onLoadLocation: () => dispatch(getLocationDataByBeacon()),
        onFetchBeaconKeys: beaconData => dispatch(fetchBeaconKeys(beaconData)),
        onLogin: () => dispatch(login()),
        onDeleteOrder: (restaurantKey, orderKey) => dispatch(deleteOrder(restaurantKey, orderKey))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Comande);

