import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import UserItem from "./UserItem.jsx";
const BASEURL = import.meta.env.VITE_BASEURL;

function GetAllUsers() {
  //   let faqs = useSelector((state) => state.faqs.faqs) || "";
  //   const dispatch = useDispatch();

  const token = localStorage.getItem("user");

  const getdata = async () => {
    try {
      const res = await axios.get(
        `${BASEURL}users/`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("inside get users", res.data);
      //   faqs = res.data.data;
      return res.data.data;
    } catch (err) {
      console.log(err);
    }
  };

  const { data, isSuccess } = useQuery({
    queryKey: ["users"],
    queryFn: async () => await getdata(),
    enabled: !!token,
  });

  if (isSuccess) console.log("Data fatched ", data);

  // const faqs = useSelector((state) => state.faqs.faqs);
  return (
    <>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              All Users
            </h2>
          </div>

          <div className="mt-4 ]]">
            {data?.map((user, ind) => (
              <UserItem user={user} key={ind} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default GetAllUsers;
