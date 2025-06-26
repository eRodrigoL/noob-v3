// components/cards/GameCard/styles.ts
import { StyleSheet } from 'react-native';

export const CARD_WIDTH = 260;
export const CARD_HEIGHT = 340;
export const CARD_GAP = 16;

const stylesGameCard = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: CARD_GAP,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    width: '100%',
    height: '75%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '95%',
    height: '95%',
    resizeMode: 'contain',
  },
  textContainer: {
    padding: 8,
  },
  title: {
    marginBottom: 4,
    textAlign: 'center',
  },
  score: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default stylesGameCard;
