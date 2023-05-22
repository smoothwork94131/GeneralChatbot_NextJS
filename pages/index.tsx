
import { Props } from '../utils/app/useUser';
import { getSheets } from './api/googlesheets';


import dynamic from 'next/dynamic'
const OpenAi = dynamic(() => import('@/components/openai/openai'), { ssr: false })

const Home = ({
  serverRoleData
}) => {
  return (
    <OpenAi serverRoleData = {serverRoleData}/>
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