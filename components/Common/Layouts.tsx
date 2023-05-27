import AccountLayout from "@/components/Account/Layout";
import MainLayout from "./MainLayout";

export const Layouts = {
  Account: AccountLayout,
  Main: MainLayout
};
export type LayoutKeys = keyof typeof Layouts; // "Main" | "Admin"

