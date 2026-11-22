import { apiBaseUrl } from './api-base'
import axios from "axios";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";

const API_BASE_URL = apiBaseUrl();

const SIGN_IN_HANDLERS = {
  credentials: async () => {
    return true;
  },
  google: async (account) => {
    try {
      let referralCode = "";
      try {
        const cookieStore = cookies();
        referralCode = cookieStore.get("rshq_referral_code")?.value || "";
      } catch (e) {
        console.error("Error reading referral cookie in NextAuth:", e);
      }

      const response = await axios.post(
        `${API_BASE_URL}/auth/google-login/`,
        { 
          id_token: account.id_token,
          referral_code: referralCode
        }
      );
      account.meta = response.data;
      return true;
    } catch (error) {
      console.error("Google Sign-In Error:", error.response?.data || error.message);
      return false;
    }
  },
};

const SIGN_IN_PROVIDERS = Object.keys(SIGN_IN_HANDLERS);

async function refreshAccessToken(refreshToken) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/token/refresh/`,
      { refresh: refreshToken }
    );
    const { access, refresh } = response.data;
    return { access, refresh };
  } catch (error) {
    console.error("refresh token error:", error.response?.data || error.message);
    return null;
  }
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      params: {
        prompt: "consent",
        access_type: "offline",
        response_type: "code",
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
        email: { label: "Email", type: "text" },
      },
      async authorize(credentials) {
        try {
          const isOtpVerification = !!credentials.otp;
          const url = isOtpVerification 
            ? `${API_BASE_URL}/auth/verify-otp/`
            : `${API_BASE_URL}/auth/login/`;

          const payload = isOtpVerification
            ? { email: credentials.email, code: credentials.otp }
            : { username: credentials.username, password: credentials.password };

          const response = await axios.post(url, payload);

          if (response.data.message && response.data.message.includes("2FA OTP sent")) {
            throw new Error("2FA_REQUIRED:" + response.data.email);
          }

          const { access, refresh } = response.data;
          if (!access) throw new Error("No access token received");

          const tokenDecoded = jwtDecode(access);
          return {
            accessToken: access,
            refreshToken: refresh,
            id: tokenDecoded.user_id,
            name: response.data.username || credentials.username || response.data.email,
            email: response.data.email || credentials.email,
            image: response.data.profile_pic || null,
          };
        } catch (error) {
          if (error.message && error.message.startsWith("2FA_REQUIRED:")) throw error;
          const detail = error.response?.data?.detail || error.response?.data?.message || "Invalid credentials";
          throw new Error(detail);
        }
      },
    }),
  ],
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (!SIGN_IN_PROVIDERS.includes(account.provider)) return false;
      return SIGN_IN_HANDLERS[account.provider](account, user, profile, email, credentials);
    },
    async jwt({ token, user, account, trigger, session }) {
      if (trigger === "update" && session?.image) {
        token.picture = session.image;
      }

      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        if (user.image) token.picture = user.image;
      }
      if (account && account.provider === "google") {
        token.accessToken = account.meta.access;
        token.refreshToken = account.meta.refresh;
        token.id = account.meta.user_id;
        token.name = account.meta.name;
        token.email = account.meta.email;
        if (account.meta.profile_pic || account.meta.picture) {
           token.picture = account.meta.profile_pic || account.meta.picture;
        }
      }

      // Handle token expiration and refresh
      if (token.accessToken) {
          try {
              const decoded = jwtDecode(token.accessToken);
              token.exp = decoded.exp;
              if (Date.now() >= decoded.exp * 1000) {
                const newToken = await refreshAccessToken(token.refreshToken);
                if (newToken) {
                  token.accessToken = newToken.access;
                }
              }
          } catch (e) {
              console.error("JWT Decode/Refresh Error:", e);
          }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        image: token.picture || null,
      };
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return baseUrl + url;
      else {
          try {
              const urlObj = new URL(url);
              if (urlObj.origin === baseUrl) return url;
          } catch (e) {}
      }
      return baseUrl + "/dashboard";
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/auth/login" },
  debug: true,
};
