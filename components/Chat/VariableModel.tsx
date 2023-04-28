import { FC, KeyboardEvent, useEffect, useRef, useState } from 'react';
const VariableModel: FC = () => {
    return (
        <div>   
            <textarea
                className="mt-1 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#40414F] dark:text-neutral-100"
                style={{ resize: 'none' }}
                rows={3}
            />           
        </div>
    )
}
export default VariableModel;