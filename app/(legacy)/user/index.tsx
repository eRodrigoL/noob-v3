// app/index.tsx
import { Redirect } from 'expo-router';

export default function Home() {
  return <Redirect href={'/(legacy)/user/Login'} />;
}
