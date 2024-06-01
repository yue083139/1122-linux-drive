import { ElMessage } from "element-plus";

const isLoggedIn = ref<boolean | null>(null);
const roomId = ref<string | null>(null);

async function login(_roomId?: string) {
  try {
    const res = await $fetch("/api/auth/login", {
      method: "POST",
      body: { roomId: _roomId },
    });
    const { roomId: id = null, error } = res;
    if (error) throw error;
    if (!id) throw new Error("Room does not exist.");
    isLoggedIn.value = Boolean(id);
    roomId.value = id || null;
    ElMessage.success(`Joined room [${id}].`);
    return res;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    try {
      if (isLoggedIn.value !== null) ElMessage.error(message);
    } catch {}
    isLoggedIn.value = false;
    roomId.value = null;
    return { roomId: null, error: message };
  }
}

async function logout() {
  await $fetch("/api/auth/logout", { method: "POST" });
  isLoggedIn.value = false;
  roomId.value = null;
}

await login();

export default function () {
  watch(isLoggedIn, (v) => {
    if (!v) navigateTo("/login");
  });
  return {
    isLoggedIn,
    roomId,
    login,
    logout,
  };
}
