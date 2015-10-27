/* eslint no-unused-expressions: 0 */
import React from 'react/addons';

export default {
  /*
   * Find and return all matched children by type. `type` can be a React element class or
   * string
   */
  findAllByType(children, type) {
    let result = [];

    if (type && type.displayName) {
      type = type.displayName;
    }

    React.Children.forEach(children, child => {
      if (child && child.type && child.type.displayName === type) {
        result.push(child);
      }
    });

    return result;
  },

  /*
   * Return the first matched child by type, return null otherwise.
   * `type` can be a React element class or string.
   */
  findChildByType(children, type) {
    this.findAllByType(children, type)[0];
  },

  /*
   * Create a new array of children excluding the ones matched the type
   */
  withoutType(children) {
    let newChildren = [];
    let types = [].slice.call(arguments, 1);

    types = types.map(type => {
      if (type && type.displayName) { return type.displayName; }
      return type;
    });

    React.Children.forEach(children, child => {
      if (child && child.type && child.type.displayName && types.indexOf(child.type.displayName) !== -1) {
        return;
      }
      newChildren.push(child);
    });

    return newChildren;
  }
};
