import React, { Component } from 'react';
import {
    Container,
    Header,
    Left,
    Button,
    Body,
    Right,
    Input,
    ListItem,
    Text
} from 'native-base';
import { StyleSheet, FlatList, TouchableOpacity, Platform, NativeModules, Linking } from "react-native";
import { connect } from "react-redux";
import FormTextInput from "../../components/FormTextInput/FormTextInput";
import { Navigation } from 'react-native-navigation';
import { loginRestaurant, searchRestaurant, getRestaurantData } from "../../store/actions/index"
import Icon from 'react-native-vector-icons/FontAwesome5';

const deviceLanguage =
    Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
        : NativeModules.I18nManager.localeIdentifier;

class Search extends React.Component {
    state = {
        searchBar: ""
    };

    constructor(props) {
        super(props);
    }

    static get options() {
        return {
            topBar: {
                visible: false,
                animate: false,
                height: 0,
            }
        };
    }

    onSuccess = e => {
        Linking.openURL(e.data).catch(err =>
            console.error('An error occured', err)
        );
    };

    handleEmailChange = (email) => {
        this.setState({ email: email });
    };

    handlePasswordChange = (password) => {
        this.setState({ password: password });
    };
    handleLoginPress = () => {
        this.props.onLoginRestaurant(this.state.email, this.state.password);
    }

    handleBackButton = () => {
        Navigation.pop(this.props.componentId);
    }

    handleTextChange = (text) => {
        this.setState({ searchBar: text });
    };

    handleSearchSubmit = () => {
        this.props.onSearchRestaurant(this.state.searchBar);
    }

    handleGetRestaurantData = restaurantKey => {
        this.props.onGetRestaurantData(restaurantKey);
    }


    render() {
        let items = null;
        let results = this.props.searchResults;
        let number = this.props.numberOfResults;
        if (number > 0) {
            items = (
                <FlatList
                    style={styles.flatList}
                    data={results}
                    keyExtractor={item => item.restaurantKey}
                    renderItem={item => {
                        return (
                            <ListItem style={styles.listItem}>
                                <Body>
                                    <TouchableOpacity onPress={() => {
                                        let data = {
                                            restaurantKey: item.item.restaurantKey
                                        };
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
            items = null;
        }

        return (
            <Container >
                <Header style={{ backgroundColor: "#4bac61" }}
                    androidStatusBarColor={"#4bac61"} hasTabs>
                    <Left>
                        <Button transparent onPress={() => this.handleBackButton()}>
                            <Icon style={styles.icon} name='arrow-left' />
                        </Button>
                    </Left>
                    <Body >
                        <Input
                            onChangeText={this.handleTextChange}
                            value={this.state.searchBar}
                            style={styles.input}
                            autoFocus={true}
                            placeholderTextColor="#fff"
                            placeholder={deviceLanguage == "it_IT" ?
                                "Cerca" :
                                "Search"}
                            returnKeyType="search"
                            onSubmitEditing={this.handleSearchSubmit}
                            autoCapitalize="words"

                        >

                        </Input>
                    </Body>
                    <Right>
                        <Button transparent >
                            <Icon style={styles.icon} name='times' />
                        </Button>
                    </Right>
                </Header>
                {items}
            </Container>
        );
    }
}

const styles = StyleSheet.create({
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
    icon: {
        fontSize: 30,
        color: "#fff"
    },
    input: {
        width: "100%",
        fontSize: 18,
        color: "#fff"
    },
    listItem: {
        alignSelf: "center",
        width: "96%",
        marginLeft: 0,
        marginRight: 0
    },
    listItemDisabled: {
        alignSelf: "center",
        width: "96%",
        marginLeft: 0,
        marginRight: 0,
        opacity: 0.3
    },
    flatList: {
        marginBottom: 50
    },
    title: {
        fontWeight: "600",
        fontSize: 28,
        padding: 14
    }
});


const mapStateToProps = state => {
    return {
        restaurants: state.restaurant,
        searchResults: state.restaurant.results,
        numberOfResults: state.restaurant.numberOfResults
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLoginRestaurant: (user, password) => dispatch(loginRestaurant(user, password)),
        onSearchRestaurant: text => dispatch(searchRestaurant(text)),
        onGetRestaurantData: key => dispatch(getRestaurantData(key))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);