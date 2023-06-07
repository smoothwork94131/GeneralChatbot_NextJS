import { Box } from "@mantine/core";

import { getSheets } from '@/utils/server/google_sheets';
import dynamic from 'next/dynamic'
const OpenAi = dynamic(() => import('@/components/openai/openai'), { ssr: false })

const Home = ({
  serverRoleData,
  utilityKey
}) => {
    
  return (
    <OpenAi 
        serverRoleData = {serverRoleData}
        utilityKey={utilityKey}
    />
  )
}

interface Pathpros {
    role: string,
    group: string,
    utility: string,
}

export const getStaticPaths = async () => {
    let paths: {
        params: Pathpros
    }[] = [];

    const sheetData = await getSheets();
    sheetData.map((role_item) => {
        role_item.utilities_group.map(group => {
            group.utilities.map(utility => {
                const role_name = role_item.name.replaceAll(/ /g, "-");
                const group_name = group.name.replaceAll(/ /g, "-");
                const utility_name = utility.name.replaceAll(/ /g, "-");
                const path: Pathpros = {
                    role: role_name,
                    group: group_name,
                    utility: utility_name,
                };   
                paths.push({params: path});
            })
        })
    });
    
    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps = async ({ params }) => {
    const serverRoleData = await getSheets();
    let utilityKey='';
    serverRoleData.map((role) => {
        role.utilities_group.map(group => {
            group.utilities.map(utility => {
                if(
                    role.name == params.role,
                    group.name == params.group,
                    utility.name == params.utility.replaceAll("-", " ")
                ) {
                    utilityKey = utility.key
                }
            })
        })
    });
    
    return {
      props: {
        serverRoleData: serverRoleData,
        utilityKey: utilityKey,
      },
    };
};

export default Home;

  