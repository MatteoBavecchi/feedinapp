import React from "react";
import { StyleSheet, TextInput} from "react-native";


class FormTextInput extends React.Component {
  render() {
    // We define our own custom style for the TextInput, but
    // we still want to allow the developer to supply its
    // own additional style if needed.
    // To do so, we extract the "style" prop from all the
    // other props to prevent it to override our own custom
    // style.
    const { style, ...otherProps } = this.props;
    return (
      <TextInput
        selectionColor={"#ffffff"}
        // Add the externally specified style to our own
        // custom one
        style={[styles.textInput, style]}
        // ...and then spread all the other props
        {...otherProps}
      />
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    borderColor: "#ffffff",
    borderBottomWidth: 1,
    marginBottom: 20,
    fontSize: 18
  }
});

export default FormTextInput;