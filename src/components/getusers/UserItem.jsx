import React from "react";

const Useritem = ({ user }) => {
  //const faq = useSelector((state) => state.faqs.singlefaq);
  //   console.log(user);

  return (
    <>
      <div key={user.id} className="group relative">
        <div className="mt-4">
          <div className=" mt-2 bg-blue-300 text-start">
            <p className="text-lg text-black">First Name : {user.name}</p>
            <p className="text-lg text-black">Role : {user.role}</p>
            <p className="text-lg text-black">Email : {user.email}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Useritem;
