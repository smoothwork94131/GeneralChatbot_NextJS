import { createClient } from '@supabase/supabase-js';
import { NEXT_PUBLIC_SUPABASE_URL } from '@/utils/app/const';
import { SUPABASE_SERVICE_ROLE_KEY } from '@/utils/server/const';
import { Database } from '@/types/types_db';
import { getSheets } from '@/utils/server/google_sheets';

const supabaseAdmin = createClient<Database>(
    NEXT_PUBLIC_SUPABASE_URL || '',
    SUPABASE_SERVICE_ROLE_KEY || ''
);


export const getUpdatedBackend = async() => {
    const { data, error } = await supabaseAdmin
      .from('updated_backend')
      .select('*')
      .eq('name', "default")

    if (error) {
      return [];
    } else {
        if(data.length > 0) {
            return data[0].json_data;
        } else {
            return [];
        }
    }
}

export const updateData = async(content) => {    

    const { data, error } = await supabaseAdmin
    .from('updated_backend')
    .update([{
        name: 'default',
        json_data: content
    }])
    .eq("name", "default");

    if(error) {
        console.log(error);
        return "Error";
    } else {
        return "Success";
    }
    
}

export default async function getRoleData(req, res){
    const sheetData = await getSheets();
    const status = await updateData(sheetData);
    res.json({status: status});
}
