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
    // const exist_table = await checkIfTableExists('update_data');
    // if(exist_table) {
    if(!(await checkIfName('default'))) {    
        const { data, error } = await supabaseAdmin
        .from('updated_backend')
        .insert([{
            name: 'default',
            json_data: content
        }])

        if(error) {
            return "Error";
        } else {
            return "Success";
        }
    } else {
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
}

async function checkIfName(name) {
    const { data, error } = await supabaseAdmin
    .from('updated_backend')
    .select('*')
    .eq("name", name);
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
  