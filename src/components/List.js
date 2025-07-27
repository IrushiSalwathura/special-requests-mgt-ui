import ListItem from "./ListItem";

export default function List({data,role}){
  const isAdmin = role == "USER" ? false : true;
    return(
    <div className="overflow-x-auto p-4">
      <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg">
        <thead>
          <tr className="bg-stone-200">
          <th className="px-4 py-2 text-left"></th>
            <th className="px-4 py-2 text-left">Request Type</th>
            {isAdmin && <th className="px-4 py-2 text-left">Name</th>}
            <th className="px-4 py-2 text-left">Preferred Date/Time</th>
            <th className="px-4 py-2 text-left">Status</th>
            {!isAdmin && <th className="px-4 py-2 text-left">Edit</th>}
            {!isAdmin && <th className="px-4 py-2 text-left">Delete</th>}
            {isAdmin && <th className="px-4 py-2 text-left">Review</th>}
          </tr>
        </thead>
        <tbody className="overflow-y-auto">
            {data.map((item) => (
                <ListItem key={item._id} item={item} data={data} isAdmin={isAdmin}/>
          ))}
        </tbody>
      </table>
    </div>
  );
}
