import {
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  activeStepIconBorderColor: {
    color: '#FC6663',
  },
  completedProgressBarColor: {
    color: '#FC6663',
  },
  completedStepIconColor: {
    color: '#FC6663',
  },
  activeLabelColor: {
    color: '#FC6663',
  },
  buttonStep: {
    padding: 20,
    borderRadius: 5,
    backgroundColor: '#FC6663',
    alignSelf: 'stretch',
    margin: 15,
    marginHorizontal: 20,
  },
  nextBtnTextStyle: {
    color: '#FC6663',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',   
  },
  textStyle: {
    fontSize: 16,
  },
  inputContainer: {
    alignItems: 'center',
    width: '100%',
    maxHeight: 200,

  },
});

export default styles;