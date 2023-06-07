import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('@/components/Account/Layout'), { ssr: false });
import { AuthenticationForm } from "@/components/Account/AuthenticationForm";
const SignIn = () => {
  const closeModal = () => {

  }
  return (
      <AuthenticationForm modalType='signin' closeModal={closeModal}/>
  )
}
export default SignIn;