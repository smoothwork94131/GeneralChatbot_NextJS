import { getSheets } from "@/utils/server/google_sheets"
export const removePropmptFromRole = (roleData) => {
  const updated_roleData = roleData.map((r_item) => {
    const update_group = r_item.utilities_group.map((group_item) => {
      const update_utilities = group_item.utilities.map((utility) => {
        delete utility.system_prompt;
        delete utility.user_prompt;
        return utility;
      })
      group_item.utilities = update_utilities;
      return group_item; 
    })
    r_item.utilities_group = update_group;
    return r_item;
  })
  return updated_roleData;
}

export default async function handler(req, res){
  const result = await getSheets();
  const convertedRoleData = removePropmptFromRole(result);
  return res.json(convertedRoleData);
}

