
import { convertedSheetData, getSheets } from '@/utils/server/google_sheets';
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react';
const OpenAi = dynamic(() => import('@/components/openai/openai'), { ssr: false })

const Home = ({
  roleName,
  utilityName,
  groupName,
  ...props
}) => {

  const [utilityKey, setUtilityKey] = useState<string>('');
  const [roleIndex, setRoleIndex] = useState<number>(0);
  const serverRoleData = props.serverRoleData;

  console.log(serverRoleData);

  useEffect(()=>{
    if(serverRoleData) {
      setInitUtility();
    }
  
  }, [roleName, utilityName, groupName])

  const setInitUtility = () => {
    let utility_key = '';
    let role_index = 0;
    
    if(roleName && utilityName && groupName) {
      serverRoleData.map((role, role_index) => {
        role.utilities_group.map(group => {
          group.utilities.map((utility, utility_index) => {
            if(
              roleName.replaceAll("-", " ") == role.name &&
              utilityName.replaceAll("-", " ") == utility.name &&
              groupName.replaceAll("-", " ") == group.name
            ) {
              utility_key = utility.key;
              role_index = roleIndex;
            }
          })
        })
      })
    }
    
    if(utility_key == '') {
      const storage_key = localStorage.getItem("select_utility_key");
      if(storage_key) {
        utility_key = storage_key;
      } else {
        utility_key = serverRoleData[0].utilities_group[0].utilities[0].key;
      }
      role_index = 0;
    }
    
    setUtilityKey(utility_key);
    setRoleIndex(role_index);
    localStorage.setItem("select_utility_key", utility_key);

  } 
 
  return (
    serverRoleData && utilityKey != ''?
    <OpenAi serverRoleData = {serverRoleData} utilityKey={utilityKey}  propsRoleIndex={roleIndex} />
    :<></>
  )
}

export async function getStaticProps(context) {
  const data = await convertedSheetData();
  return {
      props: {
        serverRoleData:data
      },
  };
}

export default Home;
