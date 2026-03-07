import type { JwtUserInfo } from "../../shared/types/JwtUserInfo";

/**
 * Composable để xác thực user
 * Kiểm tra JWT token và redirect về login nếu không hợp lệ
 */
export const useCheckUser = async () => {
  const token = useCookie("jwt_token");

  // Nếu không có token, redirect về login
  if (!token.value) {
    await navigateTo("/login");
    return null;
  }

  // Xác thực token
  const { data: user } = await useAsyncData<JwtUserInfo | null>(
    "auth-user",
    async () => {
      if (!token.value) return null;

      try {
        const result = await $fetch<{ success: boolean; user: JwtUserInfo }>(
          "/api/auth/verifyToken",
          {
            method: "POST",
            body: { token: token.value },
          },
        );

        return result.success ? result.user : null;
      } catch (error) {
        console.error("Token verification failed:", error);
        await navigateTo("/login");
        return null;
      }
    },
  );

  // Nếu không lấy được thông tin user, redirect về login
  if (!user.value) {
    await navigateTo("/login");
    return null;
  }

  return user.value;
};
