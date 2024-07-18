import React, { useEffect } from 'react';
import Toast from 'react-native-toast-message';

const ToastNotifier = ({ type, message }) => {
  useEffect(() => {
    if (type && message) {
      Toast.show({
        type: type,
        text1: type.charAt(0).toUpperCase() + type.slice(1),
        text2: message,
      });
    }
  }, [type, message]);

  return <Toast ref={(ref) => Toast.setRef(ref)} />;
};

export default ToastNotifier;
