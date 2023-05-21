import OpenAi from '@/components/openai/openai';
import { Props } from '../utils/app/useUser';
import { getSheets } from './api/googlesheets';
const Home = ({
  serverRoleData
}) => {
  return (
    <OpenAi  serverRoleData = {serverRoleData}/>
  )
}

export async function getStaticProps(context) {
  const data = await getSheets();
  return {
      props: {
        serverRoleData:data
      },
      revalidate: 1,
  };
}
export default Home;
