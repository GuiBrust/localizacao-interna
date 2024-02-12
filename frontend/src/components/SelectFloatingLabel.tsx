import React from 'react';
import Select, { components } from 'react-select';

const { ValueContainer, Placeholder } = components;

const CustomValueContainer = ({ children, ...props }) => (
  <ValueContainer {...props}>
    <Placeholder {...props} isFocused={props.isFocused}>
      {props.selectProps.placeholder}
    </Placeholder>
    {React.Children.map(children, (child) =>
      child && child.type !== Placeholder ? child : null
    )}
  </ValueContainer>
);

const SelectFloatingLabel = (props) => (
  <Select
    {...props}
    components={{ ValueContainer: CustomValueContainer }}
    styles={{
      container: (provided) => ({
        ...provided,
        marginTop: 10,
      }),
      valueContainer: (provided) => ({
        ...provided,
        overflow: 'visible',
      }),
      placeholder: (provided, state) => ({
        ...provided,
        position: 'absolute',
        top: state.hasValue || state.selectProps.inputValue ? -12 : "15%",
        backgroundColor: state.hasValue || state.selectProps.inputValue ? 'white' : 'transparent',
        transition: 'top 0.1s, font-size 0.1s',
        fontSize: (state.hasValue || state.selectProps.inputValue) && 13,
      }),
    }}
    classNamePrefix="select"
  />
);

export default SelectFloatingLabel;
