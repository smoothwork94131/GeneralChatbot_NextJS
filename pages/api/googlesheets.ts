import { getSheets } from "@/utils/server/google_sheets"
export const removePromptFromRole = (roleData) => {
  const updated_roleData = roleData.map((r_item) => {
    const update_group = r_item.utilities_group.map((group_item) => {
      const update_utilities = group_item.utilities.map((utility) => {
        delete utility.system_prompt;
        delete utility.user_prompt;
        const buttonGroup = utility.buttonGroup.map((group) => {
          const buttons = group.buttons.map((button) => {
            delete button.user_prompt
            delete button.system_prompt
            return button;
          })
          group.buttons = buttons;
          return group;
        })
        const settings = utility.settings.map((item) => {
          const items = item.items.map((setting) => {
            delete setting.prompt;
            return setting;
          })
          item.items = items;
          return item;
        })
        utility.settings = settings;
        utility.buttonGroup = buttonGroup;
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
  const convertedRoleData = removePromptFromRole(result);
  return res.json(convertedRoleData);
}

