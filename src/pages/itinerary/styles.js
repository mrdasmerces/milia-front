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
  versionBox: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  versionText: {
    padding: 4,
    backgroundColor: '#FFF',
    color: '#000',
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
  }
});

export default styles;