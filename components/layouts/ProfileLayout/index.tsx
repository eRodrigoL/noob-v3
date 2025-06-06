// componentes/layout/ProfileLayout/index.tsx
import { images } from '@constants/images';
import { getImageSource } from '@lib/getImageSource';
import { globalStyles, useTheme } from '@theme/index';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import stylesProfileLayout from './styles';

export interface ProfileLayoutProps {
  id?: string | null;
  name?: string | null;
  photo?: string | null;
  cover?: string | null;
  initialIsEditing?: boolean;
  initialIsRegisting?: boolean;
  children?: React.ReactNode;
  isEditing?: boolean;
  isUser?: boolean;
  isLoading?: boolean;
  setEdited?: React.Dispatch<React.SetStateAction<User>>;
}

interface User {
  id?: string;
  nome: string;
  foto?: string | null;
  capa?: string | null;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({
  id,
  name: initialName = null,
  photo,
  cover,
  isEditing = false,
  initialIsRegisting = false,
  children,
  isUser = false,
  isLoading = false,
  setEdited,
}) => {
  const [isRegisting, setIsRegisting] = useState<boolean>(!id || initialIsRegisting);
  const [selectedCoverImage, setSelectedCoverImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const { colors, fontSizes, fontFamily } = useTheme();

  // Recarrega os valores quando loading finaliza
  useEffect(() => {
    if (!isLoading) {
      setSelectedCoverImage(cover ?? null);
      setSelectedImage(photo ?? null);
      setName(initialName ?? null);
    }
  }, [isLoading, photo, cover, initialName]);

  useEffect(() => {
    if (!id) setIsRegisting(true);
  }, [id]);

  const pickBackgroundImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
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
      setSelectedCoverImage(result.assets[0].uri);
      setEdited?.((prev) => ({
        ...prev,
        capa: result.assets[0].uri,
      }));
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
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
      setEdited?.((prev) => ({
        ...prev,
        foto: result.assets[0].uri,
      }));
    }
  };

  const handleNomeChange = (value: string) => {
    setName(value);
    setEdited?.((prev) => ({
      ...prev,
      nome: value,
    }));
  };

  return (
    <View style={globalStyles.container}>
      {isUser && (
        <View style={stylesProfileLayout.containerCover}>
          <ImageBackground
            source={getImageSource(selectedCoverImage, images.fundo)}
            style={stylesProfileLayout.coverImage}
            imageStyle={{ resizeMode: 'cover' }}
          />
          {(isEditing || isRegisting) && (
            <>
              <Text
                style={[
                  stylesProfileLayout.coverInstructionText,
                  {
                    backgroundColor: colors.backgroundBase,
                    color: colors.textOnBase,
                    fontFamily,
                    fontSize: fontSizes.small,
                  },
                ]}>
                Toque para alterar a capa
              </Text>
              <Pressable onPress={pickBackgroundImage} style={StyleSheet.absoluteFill} />
            </>
          )}
        </View>
      )}

      <View
        style={[
          isUser
            ? stylesProfileLayout.containerHeaderProfileUser
            : stylesProfileLayout.containerHeaderProfileGame,
          { backgroundColor: colors.backgroundBase },
        ]}>
        {isEditing || isRegisting ? (
          <Pressable onPress={pickImage} style={stylesProfileLayout.photoContainer}>
            <Image
              source={getImageSource(selectedImage, images.userUnavailable)}
              style={stylesProfileLayout.photo}
            />
          </Pressable>
        ) : (
          <Image
            source={getImageSource(selectedImage, images.userUnavailable)}
            style={stylesProfileLayout.photo}
          />
        )}

        <TextInput
          value={name || ''}
          onChangeText={handleNomeChange}
          editable={isEditing || isRegisting}
          selectTextOnFocus={isEditing || isRegisting}
          placeholder="Digite o nome aqui..."
          style={[
            stylesProfileLayout.nameInput,
            { color: colors.textOnBase, fontFamily, fontSize: fontSizes.giant },
          ]}
        />
      </View>

      <View
        style={[
          isUser
            ? stylesProfileLayout.containerChildrenUser
            : stylesProfileLayout.containerChildrenGame,
          { backgroundColor: colors.backgroundBase, paddingHorizontal: 15 },
        ]}>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.backgroundHighlight} />
        ) : (
          children
        )}
      </View>
    </View>
  );
};

export default ProfileLayout;
