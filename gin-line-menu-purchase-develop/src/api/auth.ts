import client from "@/api/axiosClient";
import { AuthSignIn } from "@/interfaces";

export const apiUserSignIn = (data: AuthSignIn) =>
  client.post("/login", data);

export const apiUserSignOut = () => client.post('logout')