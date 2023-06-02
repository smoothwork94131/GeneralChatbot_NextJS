import { createClient } from '@supabase/supabase-js';
import { NEXT_PUBLIC_SUPABASE_URL } from '@/utils/app/const';
import { SUPABASE_SERVICE_ROLE_KEY } from '@/utils/server/const';
import { Database } from '@/types/types_db';

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
      return [];
    } else {
        if(data.length > 0) {
            return data[0].json_data;
        } else {
            return [];
        }
    }
}

export const deleteData = async() => {
    const { data, error }   = await supabaseAdmin
    .from('updated_backend')
    .delete().eq("name", "utilites_group");
}

export const updateBackendData = async(json_data) => {    

    if(await checkIfName('utilities_group')) {    
        const { data, error } = await supabaseAdmin
        .from('updated_backend')
        .update([{
            name: 'utilites_group',
            json_data: json_data
        }])
        .eq("name", "utilites_group");

        if(error) {
            return "Error";
        } else {
            return "Success";
        }
    } else {
        const { data, error } = await supabaseAdmin
        .from('updated_backend')
        .insert([{
            name: 'utilites_group',
            json_data: json_data
        }]).order("id", { ascending: true });

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
    .eq("name", "utilites_group");
    if(error) {
        return false;
    } else {
        if(data.length > 0 ) {
            return true;
        } else {
            return false;
        }
    }
}

// export default async function handler(req, res){
//     const data = req.body;
//     const result = await getUpdatedBackend();
//     res.json({status: result});
// }
  