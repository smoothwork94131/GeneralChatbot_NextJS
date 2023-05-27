import React, { PropsWithChildren } from "react";
const AdminLayout = (props: PropsWithChildren) => {
  return (
    <>
      {props.children}
    </>
  );
};
export default AdminLayout;
