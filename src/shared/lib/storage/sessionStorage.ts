import * as Keychain from "react-native-keychain";

const service = "fya-credit-session";

export async function readSession<TSession>() {
  const credentials = await Keychain.getGenericPassword({ service });
  if (!credentials) {
    return null;
  }
  try {
    return JSON.parse(credentials.password) as TSession;
  } catch {
    await clearSession();
    return null;
  }
}

export async function writeSession<TSession>(session: TSession) {
  await Keychain.setGenericPassword("session", JSON.stringify(session), { service });
}

export async function clearSession() {
  await Keychain.resetGenericPassword({ service });
}
