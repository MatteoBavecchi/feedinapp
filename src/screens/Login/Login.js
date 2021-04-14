import React, { Component } from 'react';
import { H1 } from 'native-base';
import { Image, StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { connect } from "react-redux";
import Button from "../../components/Button/Button";
import FormTextInput from "../../components/FormTextInput/FormTextInput";
import { Navigation } from 'react-native-navigation';
import { loginRestaurant, autoLogin } from "../../store/actions/index"

class Login extends React.Component {
    state = {
        email: "",
        password: ""
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

    handleBackPress = () => {
        Navigation.setRoot({
            root: {
                stack: {
                    children: [
                        {
                            component: {
                                name: 'RNFirebaseStarter.MenuScreen',
                                options: {
                                    topBar: {
                                        visible: false,
                                        animate: false,
                                        height: 0,
                                    }
                                }
                            },

                        },
                    ]
                },
            },
        })
    };

    render() {
        return (
            <View style={styles.container}>
                <H1 style={styles.logo}>FeedInApp</H1>
                <View style={styles.form}>
                    <FormTextInput
                        value={this.state.email}
                        onChangeText={this.handleEmailChange}
                        placeholder={"Email"}
                    />
                    <FormTextInput
                        value={this.state.password}
                        onChangeText={this.handlePasswordChange}
                        placeholder={"Password"}
                    />
                    <Button
                        label={"Accedi"}
                        onPress={this.handleLoginPress}
                    />
                </View>
                <TouchableOpacity

                    onPress={this.handleBackPress}
                ><Text style={styles.backButton}>Indietro</Text></TouchableOpacity>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    backButton: {
        paddingLeft: 0,
        paddingBottom: 20,
        fontSize: 18,
        color: "grey",
        textDecorationLine: "underline"
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
    form: {
        flex: 1,
        justifyContent: "center",
        width: "80%"
    }
});


const mapStateToProps = state => {
    return {
        restaurants: state.restaurant
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLoginRestaurant: (user, password) => dispatch(loginRestaurant(user, password)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);