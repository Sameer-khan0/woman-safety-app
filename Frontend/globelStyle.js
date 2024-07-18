// globelStyle.js
import { StyleSheet } from 'react-native';

const colors = {
  womanPrimary: '#894FE0',
  guardianPrimary: '#4F7EE0',
  womanSecondry: '#9575CD',
  guardianSecondry: '#64B5F6',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#9E9E9E',
  lightGray: '#F5F5F5',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    padding: 20,
    fontWeight: 'bold',
    color: 'white'
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  button: {
    padding: 12,
    marginTop: 10,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.womanPrimary,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
});

export { styles, colors };
