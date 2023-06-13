import { sheets as sheets_, auth } from '@googleapis/sheets';
import { removePromptFromRole } from '@/pages/api/googlesheets';

import {SPREAD_SHEET_ID, SHEET_RANGE, GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY} from '@/utils/server/const'
import { ButtonGroup, Buttons, Input, RoleGroup, Setting, SettingItem, UtilitiesGroup, Utility } from '@/types/role';
import { DEFAULT_SYSTEM_PROMPT } from '@/utils/app/const';
import { Button } from '@mantine/core';

let roleData:RoleGroup[] = [];
function mapRowToCustomSheetData(row: string[], headers: string[]): void {
  
  row.map((row_item, row_index) => {  

    const roleName = getFieldValue(row, headers, 'Role');
    const utilityGroupName = getFieldValue(row, headers, 'UtilityGroup');
    const utilityName = getFieldValue(row, headers, 'Utility_Name');
    const utilitySummary = getFieldValue(row, headers, 'Utility_Summary');
    const userPrompt = getFieldValue(row, headers, 'Utility_User_Prompt');
    const systemPrompt = getFieldValue(row, headers, 'Utility_System_Prompt');
    const includePromptHistory = getFieldValue(row, headers, 'Include_Prompt_History');
    const input_align = getFieldValue(row, headers, `Input_Align`);
    const streaming = getFieldValue(row, headers, `Streaming`);
    const buttonName = getFieldValue(row, headers, `Button_Name`);
    const buttonUserPrompt = getFieldValue(row, headers, `Button_User_Prompt`);
    const buttonSystemPrompt = getFieldValue(row, headers, `Button_System_Prompt`);
    const groupName = getFieldValue(row, headers, `Group_Name`);
    
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
        streaming: streaming=='TRUE' || streaming=="1"? true:false,
        buttonGroup:[],
        settings: getSettings(row, headers)
      })
    } else {
      utilities[utility_index].settings = getSettings(row,headers);
    }
   
    if(roleName == roleData[role_index].name && utilityGroupName == utilities_group[utilities_group_index].name) {
      let button_group: ButtonGroup[] = [];
      
      const utility = utilities[utility_index];
      
      if(utility.buttonGroup) {
        button_group = utility.buttonGroup;
      }
      
      if(groupName) {
        const group_index = chkExistObject(button_group, groupName);
        if(
          group_index == button_group.length
        ) {
          button_group.push({
            name: groupName,
            buttons:[]
          }); 
        }
        let buttons:Buttons[] = button_group[group_index].buttons;
        if(groupName == button_group[group_index].name){
          if(buttonName) {
            const buttons_index = chkExistObject(button_group[group_index].buttons, buttonName);
            if(buttons_index == button_group[group_index].buttons.length) {
              const item = {
                name: buttonName,
                user_prompt: buttonUserPrompt,
                system_prompt: buttonSystemPrompt
              };
              buttons.push(item);
            }
          }
        }
        button_group[group_index].buttons = buttons;
      }

      utility.buttonGroup = button_group;
      utilities[utility_index] = utility;
    }

    utilities_group[utilities_group_index].utilities = utilities;
    roleData[role_index].utilities_group = utilities_group;
    
  })
}

function chkExistObject(object: RoleGroup[] | UtilitiesGroup[] | Utility[] | ButtonGroup[] | Buttons[], objectName: string) {
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

function getSettings(row, headers) {
  const setting_data:Setting[] = [];
  const settings = getFieldValue(row, headers, "Settings");
  
  if(settings) {
    const arr_settings = settings.replaceAll(" ","").split(";");
    arr_settings.map((setting, index) => {
      let active = false;
      if(index == 0) {
        active = true;
      }
      let setting_item:Setting = {
        name: setting,
        items:[],
      }
      const part = getFieldValue(row, headers, setting);
      const arr_group =  part.split("; ");
      let items:SettingItem[] = [];
      let group_index = 0;
      arr_group.map((group) => {
        const parse_group = group.replaceAll(" ", "_");
        const field_name = `${setting}_${parse_group}`;
        const item = getFieldValue(row, headers, field_name);
        
        console.log(group);

        if(item) {
          let item_active = false;
          if(group_index == 0) {
            item_active = true;
          }

          items.push({
            name: group,
            prompt: item,
            active: item_active
          });
          group_index++;
        }

      })
      setting_item.items = items;
      setting_data.push(setting_item)
    }) 
  }
  return setting_data;
}

async function getSheetData(range: string) {

  const sheet_data = await getDataFromGoogleSheet(range);
  const rows = sheet_data.data.values;
  if (!rows) throw new Error('No data found in the sheet');
  const headers = rows.shift();
  if (!headers) throw new Error('No headers found in the sheet');
  rows.map(row => mapRowToCustomSheetData(row, headers));
}


async function getData(range) {
  roleData = [];
  await getSheetData('Sheet1');
  await getSheetData(`Custom_Buttons`);
  await getSheetData(`Custom_Settings`);
}

async function getDataFromGoogleSheet(range: string) {
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
      spreadsheetId: SPREAD_SHEET_ID, 
      range: range 
    });
    


    return response;
   
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    throw error;
  }
}

export async function getSheets(){
  const result = await getData(SHEET_RANGE);
  return roleData;
}

export async function convertedSheetData() {
  const sheet_data = await getSheets();
  const converted_data = removePromptFromRole(sheet_data);
  return converted_data;
}
