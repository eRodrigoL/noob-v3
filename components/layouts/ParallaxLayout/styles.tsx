// components/layout/ProfileLayout/styles.ts
import { StyleSheet } from 'react-native';

const heightCover = 200;
const heightPhoto = 180;

const stylesParallaxLayout = StyleSheet.create({
  containerCover: {
    position: 'absolute',
    top: 0,
    zIndex: 2, // <- adiciona zIndex
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
  coverTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    marginLeft: 170,
    height: '100%',
  },
  containerHeaderProfileYesCover: {
    marginTop: heightCover,
    position: 'absolute',
    top: 0,
    zIndex: 3, // <- adiciona zIndex maior que o cover
    width: '100%',
    justifyContent: 'center',
    borderTopWidth: 3,
    height: heightPhoto / 2,
  },
  containerHeaderProfileNoCover: {
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
    bottom: -30, // <- ajusta para sair ainda mais do header
    left: 15, // melhor que left: 0
    zIndex: 4, // <- garante que fique acima de tudo
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
  containerChildrenYesCover: {
    marginTop: heightCover + heightPhoto / 2,
    flex: 1,
  },
  containerChildrenNoCover: {
    marginTop: heightPhoto,
    flex: 1,
  },
});

export default stylesParallaxLayout;
