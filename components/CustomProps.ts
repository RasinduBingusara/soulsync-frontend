export interface PostProps {
  id: string;
  content: string;
  uid: string;
  email: string;
  mood: string;
  isAnonymouse: boolean;
  profileName: string;
  onClose: () => void;
}
