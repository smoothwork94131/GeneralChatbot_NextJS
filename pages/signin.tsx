import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('@/components/Account/Layout'), { ssr: false });
import { AuthenticationForm } from "@/components/Account/AuthenticationForm";
const SignIn = () => {
  const closeModal = () => {

  }
  return (
    <Layout childrenSize='400px'>
      <AuthenticationForm modalType='signin' closeModal={closeModal}/>
    </Layout>
  )
}
export default SignIn;