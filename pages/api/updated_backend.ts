import { createClient } from '@supabase/supabase-js';
import { NEXT_PUBLIC_SUPABASE_URL } from '@/utils/app/const';
import { SUPABASE_SERVICE_ROLE_KEY } from '@/utils/server/const';
import { Database } from '@/types/types_db';
import { getSheets } from './googlesheets';
import { RoleGroup } from '@/types/role';

const supabaseAdmin = createClient<Database>(
    NEXT_PUBLIC_SUPABASE_URL || '',
    SUPABASE_SERVICE_ROLE_KEY || ''
);


export const getUpdatedBackend = async() => {

    const { data, error } = await supabaseAdmin
      .from('updated_backend')
      .select('*')
      .eq('name', "utilites_group")

    if (error) {
      console.log(error)
      return []
    } else {
        if(data.length > 0) {
            return JSON.parse(data[0].content);
        } else {
            return [];
        }
    }
}

export const updateData = async(content) => {    
    // const exist_table = await checkIfTableExists('update_data');
    // if(exist_table) {
    if(await checkIfName('utilities_group')) {    
        const { data, error } = await supabaseAdmin
        .from('updated_backend')
        .insert([{
            name: 'utilites_group',
            content: JSON.stringify(content)
        }])

        if(error) {
            console.log(error);
            return "Error";
        } else {
            return "Success";
        }
        
    } else {
        const { data, error } = await supabaseAdmin
        .from('updated_backend')
        .update([{
            name: 'utilites_group',
            content: JSON.stringify(content)
        }])
        .eq("name", "utilites_group");

        if(error) {
            console.log(error);
            return "Error";
        } else {
            return "Success";
        }
    }
}

async function checkIfName(name) {
    const { data, error } = await supabaseAdmin
    .from('updated_backend')
    .select('*')
    .eq('name', name)
    if(data) {
        return data.length;
    } else {
        return false;
    }
}

export default async function handler(req, res){
    const data = req.body;
    const result = await updateData(data);
    res.json({status: result});
}
  