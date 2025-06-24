// componentes/layout/ProfileLayout/index.tsx
import { images } from '@constants/images';
import { getImageSource } from '@lib/getImageSource';
import { globalStyles, useTheme } from '@theme/index';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import stylesProfileLayout from './styles';

interface ProfileEntity {
  id?: string;
  nome: string;
  foto?: string | null;
  capa?: string | null;
}

export interface ProfileLayoutProps {
  id?: string | null;
  name?: string | null;
  photo?: string | null;
  cover?: string | null;
  children?: React.ReactNode;
  isEditing?: boolean;
  isRegisting?: boolean;
  isUser?: boolean;
  isLoading?: boolean;
  setEdited?: React.Dispatch<React.SetStateAction<ProfileEntity>>;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({
  id,
  name: initialName = null,
  photo,
  cover,
  isEditing = false,
  isRegisting = false,
  children,
  isUser = false,
  isLoading = false,
  setEdited,
}) => {
  const [selectedCoverImage, setSelectedCoverImage] = useState<string | null>(cover || null);
  const [selectedImage, setSelectedImage] = useState<string | null>(photo || null);
  const [name, setName] = useState<string | null>(initialName);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const { colors, fontSizes, fontFamily } = useTheme();

  // Recarrega os valores quando loading finaliza
  useEffect(() => {
    if (!isLoading) {
      setSelectedCoverImage(cover ?? null);
      setSelectedImage(photo ?? null);
      setName(initialName ?? null);
    }
  }, [isLoading, photo, cover, initialName]);

  const pickImageGeneric = async (
    aspect: [number, number],
    onSuccess: (uri: string, file: File | { uri: string; name: string; type: string }) => void,
    isCover: boolean = false
  ) => {
    if (Platform.OS === 'web') {
      const ref = isCover ? coverInputRef.current : fileInputRef.current;
      ref?.click();
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Toast.show({ type: 'error', text1: 'Permissão necessária para acessar a galeria!' });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const filename = uri.split('/').pop()!;
      const match = /\.(\w+)$/.exec(filename);
      const fileType = match ? `image/${match[1]}` : `image`;

      const pseudoFile = {
        uri,
        name: filename,
        type: fileType,
      };

      onSuccess(uri, pseudoFile);
    }
  };

  const pickImage = () => {
    pickImageGeneric(
      [1, 1],
      (uri, file) => {
        setSelectedImage(uri);
        setEdited?.((prev) => ({ ...prev, foto: file as any }));
      },
      false
    );
  };

  const pickBackgroundImage = () => {
    pickImageGeneric(
      [16, 9],
      (uri, file) => {
        setSelectedCoverImage(uri);
        setEdited?.((prev) => ({ ...prev, capa: file as any }));
      },
      true
    );
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>, isCover = false) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const uri = URL.createObjectURL(file);
    if (isCover) {
      setSelectedCoverImage(uri);
      setEdited?.((prev) => ({ ...prev, capa: file as any }));
    } else {
      setSelectedImage(uri);
      setEdited?.((prev) => ({ ...prev, foto: file as any }));
    }
  };

  const handleNomeChange = (value: string) => {
    setName(value);
    setEdited?.((prev) => ({ ...prev, nome: value }));
  };

  const canEdit = isEditing || isRegisting;

  return (
    <View style={globalStyles.container}>
      {Platform.OS === 'web' && (
        <>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={(e) => handleFileInput(e, false)}
          />
          <input
            type="file"
            accept="image/*"
            ref={coverInputRef}
            style={{ display: 'none' }}
            onChange={(e) => handleFileInput(e, true)}
          />
        </>
      )}

      {isUser && (
        <View style={stylesProfileLayout.containerCover}>
          <ImageBackground
            source={getImageSource(selectedCoverImage, images.fundo)}
            style={stylesProfileLayout.coverImage}
            imageStyle={{ resizeMode: 'cover' }}
          />
          {canEdit && (
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
        {canEdit ? (
          <Pressable onPress={pickImage} style={stylesProfileLayout.photoContainer}>
            <Image
              source={getImageSource(selectedImage, images.userUnavailable)}
              style={[stylesProfileLayout.photo, { backgroundColor: colors.backgroundBase }]}
            />
          </Pressable>
        ) : (
          <Image
            source={getImageSource(selectedImage, images.userUnavailable)}
            style={[stylesProfileLayout.photo, { backgroundColor: colors.backgroundBase }]}
          />
        )}

        {canEdit ? (
          <TextInput
            style={[
              stylesProfileLayout.nameInput,
              { color: colors.textOnBase, fontFamily, fontSize: fontSizes.giant },
            ]}
            placeholder={isUser ? 'Digite o nome aqui...' : 'Digite o nome do jogo aqui...'}
            value={name || ''}
            onChangeText={handleNomeChange}
          />
        ) : (
          <Text
            style={[
              stylesProfileLayout.name,
              { color: colors.textOnBase, fontFamily, fontSize: fontSizes.giant },
            ]}>
            {name || 'Título não informado'}
          </Text>
        )}
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
