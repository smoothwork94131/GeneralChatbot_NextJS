
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
    async function fetchData() {
      const sheetDataResponse = await fetch("/api/googlesheets");
      const data = await sheetDataResponse.json();
      console.log(data);
      setServerRoleData(data);
    }
    fetchData();

  }, [])

  useEffect(()=>{
    serverRoleData.map((role, role_index) => {
      role.utilities_group.map(group => {
        group.utilities.map((utility, utility_index) => {
          if(
            role_index == 0 &&
            utility_index == 0
          ) {
            setUtilityKey(utility.key);
            setRoleIndex(role_index);
          }
        })
      })
    })

  }, [serverRoleData]);
  
  return (
    serverRoleData.length > 0 && utilityKey != ''?
    <OpenAi serverRoleData = {serverRoleData} utilityKey={utilityKey}  propsRoleIndex={roleIndex}/>
    :<>Loading...</>
  )
}

export default Home;
