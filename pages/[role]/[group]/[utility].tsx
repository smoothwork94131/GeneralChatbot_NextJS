
import OpenAi from '@/components/openai/openai';
import { getSheets } from '@/utils/server/google_sheets';


const Home = ({
    serverRoleData,
    utilityKey,
    roleIndex
}) => {
    
  return (
    // <OpenAi 
    //     serverRoleData={serverRoleData}
    //     utilityKey={utilityKey}
    //     propsRoleIndex={roleIndex}
    // />
    <></>
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
    let utilityKey=''; let roleIndex = 0;
    serverRoleData.map((role, role_index) => {
        role.utilities_group.map(group => {
            group.utilities.map(utility => {
                if(
                    role.name == params.role,
                    group.name == params.group,
                    utility.name == params.utility.replaceAll("-", " ")
                ) {
                    utilityKey = utility.key
                    roleIndex=role_index;
                }
            })
        })
    });
    
    if(utilityKey == '') {
        utilityKey = `${serverRoleData[0].name}_${serverRoleData[0].utilities_group[0].name}_${serverRoleData[0].utilities_group[0].utilities[0].name}`;
    }
    
    console.log("utilityKey", utilityKey);
    return {
      props: {
        serverRoleData: serverRoleData,
        utilityKey: utilityKey,
        roleIndex:roleIndex
      },
    };
};

export default Home;

  