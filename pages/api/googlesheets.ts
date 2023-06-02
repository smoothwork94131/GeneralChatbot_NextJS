import { sheets as sheets_, auth } from '@googleapis/sheets';

import {SPREAD_SHEET_ID, SHEET_RANGE, GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY} from '@/utils/server/const'
import { Input, RoleGroup, UtilitiesGroup, Utility } from '@/types/role';
import { DEFAULT_SYSTEM_PROMPT } from '@/utils/app/const';
import { getUpdatedBackend, updateData } from './updated_backend';

let roleData:RoleGroup[] = [];
function mapRowToCustomData(row: string[], headers: string[]): void {
  
  row.map((row_item, row_index) => {  

    const roleName = getFieldValue(row, headers, 'Role');
    const utilityGroupName = getFieldValue(row, headers, 'UtilityGroup');
    const utilityName = getFieldValue(row, headers, 'Utility_Name');
    const utilitySummary = getFieldValue(row, headers, 'Utility_Summary');
    const userPrompt = getFieldValue(row, headers, 'Utility_User_Prompt');
    const systemPrompt = getFieldValue(row, headers, 'Utility_System_Prompt');
    const includePromptHistory = getFieldValue(row, headers, 'Include_Prompt_History');
    const input_align = getFieldValue(row, headers, `Input_Align`);
    let streamming = getFieldValue(row, headers, `Streamming`) == ""? false:true;
    
    let role_index = chkExistObject(roleData, roleName);
    
    if(role_index == roleData.length) {
      const role:RoleGroup = {
        name: roleName,
        utilities_group:[]
      };
      roleData.push(role);
    }
    
    

    let utilities_group = roleData[role_index].utilities_group;
    let utilities_group_index = chkExistObject(utilities_group, utilityGroupName);

    if(utilities_group_index == utilities_group.length){
      let active = false;
      if(utilities_group_index == 0) {
        active = true;
      }
      utilities_group.push({
        name: utilityGroupName,
        utilities:[],
        active: active
      })
    }


    let utilities = utilities_group[utilities_group_index].utilities;
    let utility_index = chkExistObject(utilities, utilityName);
    

    if(utility_index == utilities.length) {
      let active = false;
      if(utility_index == 0 && utilities_group_index == 0 ) {
        active = true;
      }
      utilities.push({
        name: utilityName,
        active: active,
        summary: utilitySummary?utilitySummary:'',
        user_prompt: userPrompt?userPrompt:'',
        system_prompt: systemPrompt?systemPrompt:DEFAULT_SYSTEM_PROMPT,
        include_prompt_history: includePromptHistory=='TRUE' || includePromptHistory=="1"? true:false,
        key: `${roleName}_${utilityGroupName}_${utilityName}`,
        inputs: getUtilityInputs(row, headers),
        input_align: input_align?input_align:'horizental',
        streamming: streamming
      })
    }
    utilities_group[utilities_group_index].utilities = utilities;
    roleData[role_index].utilities_group = utilities_group;

  })
}

function chkExistObject(object: RoleGroup[] | UtilitiesGroup[] | Utility[], objectName: string) {
  let index = object.length;
  object.map((item, item_index) => {
    if(item.name == objectName) {
      index = item_index;
    }
  });
  return index;
}
function getFieldValue(row, headers, fieldName){
  let value: string | boolean = '';
  headers.map((item, index) => {
    if(item == fieldName) {
      value = row[index];
    }
  });

  return value;
}

function getUtilityInputs(row, headers) {
  let inputs:Input[] = [];
  let input_number = getFieldValue(row, headers, "Number_of_inputs");
  if(!input_number) {
    return [];
  }
  for(let k = 0; k < Number(input_number); k++) {
    const name = getFieldValue(row, headers, `Input_${k+1}_Name`);
    const type = getFieldValue(row, headers, `Input_${k+1}_Type`);
    const component = getFieldValue(row, headers, `Input_${k+1}_Component`);
    const value = getFieldValue(row, headers, `Input_${k+1}_Value`);
    const option = getFieldValue(row, headers, `Input_${k+1}_Options`).replace(/ /g, "").split(",");
    const style = getFieldValue(row, headers, `Input_${k+1}_Style`);
    inputs.push({
      name: name?name:'',
      type: type?type:'',
      component: component?component:'',
      value: value?value:'',
      options: option?option:[''],
      style: style?style:'',
      
    });
  }
  return inputs;
}

async function getSheetData(spreadsheetId: string, range: string): Promise<void> {
  roleData = [];
  try {
    const target = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
    const jwt = new auth.JWT(
      GOOGLE_SHEETS_CLIENT_EMAIL,
      undefined,
      ( GOOGLE_SHEETS_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      target
    );
    
    const sheets = sheets_({ version: 'v4', auth: jwt });
    const response = await sheets.spreadsheets.values.get({ 
      spreadsheetId: spreadsheetId, 
      range: range 
    });

    const rows = response.data.values;
    if (!rows) throw new Error('No data found in the sheet');
    const headers = rows.shift();
    
    if (!headers) throw new Error('No headers found in the sheet');
    
    rows.map(row => mapRowToCustomData(row, headers));
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    throw error;
  }
}

export const removePropmptFromRole = () => {
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
  const convertedRoleData = await getSheets();
  return res.json(convertedRoleData);
}

export  async function getSheets(){
  const result = await getSheetData(SPREAD_SHEET_ID ,SHEET_RANGE)
  await updateData(roleData);
  const convertedRoleData = removePropmptFromRole();
  return convertedRoleData;
}
