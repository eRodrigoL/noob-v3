// components/layout/ParallaxLayoutt/index.tsx

import { HEADER_LAYOUT_HEIGHT } from '@components/layouts/HeaderLayout/styles';
import { images } from '@constants/images';
import { getImageSource } from '@lib/getImageSource';
import { globalStyles, useTheme } from '@theme/index';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import styles from './styles';

const heightCover = 200;
const heightPhoto = 180;
const windowHeight = Dimensions.get('window').height;

export interface ParallaxLayoutProps {
  id?: string | null;
  name?: string | null;
  photo?: string | null;
  cover?: string | null;
  initialIsEditing?: boolean;
  initialIsRegisting?: boolean;
  children?: React.ReactNode;
  isEditing?: boolean;
  isUser?: boolean; // Define se o layout é de perfil de usuário ou de perfil de jogo
  setEdited?: React.Dispatch<React.SetStateAction<User>>;
}

interface User {
  id?: string;
  nome: string;
  foto?: string | null;
  capa?: string | null;
}

const ParallaxLayout: React.FC<ParallaxLayoutProps> = ({
  id,
  name: initialName = null,
  photo,
  cover,
  isEditing = false,
  initialIsRegisting = false,
  children,
  isUser = false, // por padrã, não exibe a capa (cover)
  setEdited,
}) => {
  const [isRegisting, setIsRegisting] = useState(!id || initialIsRegisting);
  const [selectedCoverImage, setselectedCoverImage] = useState(cover || null);
  const [selectedImage, setSelectedImage] = useState(photo || null);
  const [name, setName] = useState(initialName);
  const { colors, fontSizes, fontFamily } = useTheme();

  const scrollY = new Animated.Value(0);

  useEffect(() => {
    if (!id) setIsRegisting(true);
  }, [id]);

  const pickBackgroundImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Toast.show({ type: 'error', text1: 'Permissão necessária para acessar a galeria!' });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });
    if (!result.canceled) {
      setselectedCoverImage(result.assets[0].uri);
      setEdited?.((prev) => ({ ...prev, capa: result.assets[0].uri }));
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Toast.show({ type: 'error', text1: 'Permissão necessária para acessar a galeria!' });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setEdited?.((prev) => ({ ...prev, foto: result.assets[0].uri }));
    }
  };

  const handleNomeChange = (value: string) => {
    setName(value);
    setEdited?.((prev) => ({ ...prev, nome: value }));
  };

  const coverTranslateY = scrollY.interpolate({
    inputRange: [0, heightCover],
    outputRange: [0, -heightCover],
    extrapolate: 'clamp',
  });
  const headerHeight = scrollY.interpolate({
    inputRange: [0, heightCover],
    outputRange: [heightPhoto / 2, heightPhoto],
    extrapolate: 'clamp',
  });
  const headerMarginTop = scrollY.interpolate({
    inputRange: [0, heightCover],
    outputRange: [heightCover, 0],
    extrapolate: 'clamp',
  });

  const showCover = isEditing || isRegisting || !!cover;
  const minContentHeight =
    windowHeight -
    (HEADER_LAYOUT_HEIGHT + (showCover ? heightCover + heightPhoto / 2 : heightPhoto));

  return (
    <View style={[globalStyles.container, { backgroundColor: colors.backgroundBase }]}>
      {showCover && (
        <Animated.View
          style={[styles.containerCover, { transform: [{ translateY: coverTranslateY }] }]}>
          <ImageBackground
            source={getImageSource(selectedCoverImage, images.fundo)}
            style={styles.coverImage}
          />
          {(isEditing || isRegisting) && (
            <Text
              style={{
                backgroundColor: colors.backgroundBase,
                color: colors.textOnBase,
                fontFamily,
                fontSize: fontSizes.small,
              }}>
              Toque para alterar a capa
            </Text>
          )}
          {(isEditing || isRegisting) && (
            <Pressable onPress={pickBackgroundImage} style={styles.coverTouchable} />
          )}
        </Animated.View>
      )}

      <Animated.View
        style={[
          showCover ? styles.containerHeaderProfileYesCover : styles.containerHeaderProfileNoCover,
          {
            height: headerHeight,
            marginTop: headerMarginTop,
            backgroundColor: colors.backgroundBase,
          },
        ]}>
        {isEditing || isRegisting ? (
          <Pressable onPress={pickImage} style={styles.photoContainer}>
            <Image
              source={getImageSource(selectedImage, images.userUnavailable)}
              style={styles.photo}
            />
          </Pressable>
        ) : (
          <Image
            source={getImageSource(selectedImage, images.userUnavailable)}
            style={styles.photo}
          />
        )}

        {isEditing || isRegisting ? (
          <TextInput
            style={[
              styles.nameInput,
              { color: colors.textOnBase, fontFamily, fontSize: fontSizes.giant },
            ]}
            placeholder="Digite o nome aqui..."
            value={name || ''}
            onChangeText={handleNomeChange}
          />
        ) : (
          <Text
            style={[
              styles.name,
              { color: colors.textOnBase, fontFamily, fontSize: fontSizes.giant },
            ]}>
            {name || 'Nome não informado'}
          </Text>
        )}
      </Animated.View>

      <Animated.ScrollView
        style={{ flex: 1, paddingHorizontal: 15 }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}>
        <View
          style={[
            showCover ? styles.containerChildrenYesCover : styles.containerChildrenNoCover,
            {
              backgroundColor: colors.backgroundBase,
              minHeight: minContentHeight,
            },
          ]}>
          {children}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default ParallaxLayout;
