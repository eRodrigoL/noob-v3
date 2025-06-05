import { StyleSheet } from 'react-native';

const heightCover = 200;
const heightPhoto = 180;

const stylesProfileLayout = StyleSheet.create({
  containerCover: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: heightCover,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  coverImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  coverInstructionText: {
    padding: 6,
    textAlign: 'center',
    marginTop: 10,
  },
  containerHeaderProfileUser: {
    marginTop: heightCover,
    position: 'absolute',
    top: 0,
    width: '100%',
    justifyContent: 'center',
    borderTopWidth: 3,
    height: heightPhoto / 2,
  },
  containerHeaderProfileGame: {
    marginTop: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
    justifyContent: 'center',
    borderTopWidth: 3,
    height: heightPhoto,
  },
  photoContainer: {
    width: 150,
    height: 150,
    borderRadius: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  photo: {
    width: 150,
    height: 150,
    borderWidth: 5,
    borderRadius: 15,
    position: 'absolute',
    bottom: 15,
    left: 15,
  },
  nameInput: {
    fontWeight: 'bold',
    marginLeft: 195,
    borderWidth: 1,
    right: 15,
  },
  name: {
    fontWeight: 'bold',
    marginLeft: 195,
    borderWidth: 1,
    right: 15,
  },
  containerChildrenUser: {
    marginTop: heightCover + heightPhoto / 2,
    flex: 1,
  },
  containerChildrenGame: {
    marginTop: heightPhoto,
    flex: 1,
  },
});

export default stylesProfileLayout;
