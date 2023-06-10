
import { RoleGroup } from '@/types/role';
import { getSheets } from '@/utils/server/google_sheets';
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react';
const OpenAi = dynamic(() => import('@/components/openai/openai'), { ssr: false })

const Home = ({
  roleName,
  utilityName,
  groupName,
}) => {
  const [serverRoleData, setServerRoleData] = useState<RoleGroup[]>([]);
  const [utilityKey, setUtilityKey] = useState<string>('');
  const [roleIndex, setRoleIndex] = useState<number>(0);
  useEffect(()=>{
    const fetch = async() => {
      const data = await getSheets();
      setServerRoleData(data);
    }
    fetch();
  }, [])
  useEffect(()=>{
    serverRoleData.map((role, role_index) => {
      role.utilities_group.map(group => {
        group.utilities.map(utility => {
          if(
            utility.name == utilityName &&
            role.name == roleName &&
            group.name == groupName
          ) {
            setUtilityKey(utilityKey);
            setRoleIndex(role_index);
          }
        })
      })
    })
  }, [setServerRoleData]);
  return (
    <OpenAi serverRoleData = {serverRoleData} utilityKey={utilityKey}  propsRoleIndex={roleIndex}/>
  )
}

export async function getStaticProps(context) {
  const data = await getSheets();
  return {
      props: {
        serverRoleData:data
      }
  };
}

export default Home;
