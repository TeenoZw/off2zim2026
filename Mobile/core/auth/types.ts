export type MobileAuthUser = {
  id: string;
  email: string;
  user_metadata: Record<string, any>;
};

export type MobileSession = {
  access_token: string;
  user: MobileAuthUser;
};

export type AuthListener = (
  event: 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED',
  session: MobileSession | null
) => void;

