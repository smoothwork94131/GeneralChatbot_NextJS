import Layout from "@/components/Account/Layout";
import { AuthenticationForm } from "@/components/Account/AuthenticationForm";
const SignIn = () => {
  return (
    <Layout childrenSize='400px'>
      <AuthenticationForm modalType='signin'/>
    </Layout>
  )
}
export default SignIn;