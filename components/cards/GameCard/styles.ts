// components/cards/GameCard/styles.ts
import { StyleSheet } from 'react-native';

const stylesGameCard = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 8,
    margin: 8,
    minWidth: 180,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    resizeMode: 'cover',
  },
  textContainer: {
    padding: 8,
  },
  title: {
    marginBottom: 4,
  },
  score: {
    fontStyle: 'italic',
  },
});

export default stylesGameCard;
