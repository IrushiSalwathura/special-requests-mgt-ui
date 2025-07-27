import { PencilIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ListItem({item,data,isAdmin}){
    const router = useRouter();
    const requestId = item._id;

    const handleReview = () => {
        router.push(`/reviewRequest?id=${requestId}`);
    }

    const handleEdit = () => {
        router.push(`/request?id=${requestId}`);
    }

    const handleDelete = async () => {
        //Get users confirmation
        const userConfirmed = window.confirm('Are you sure you want to delete this request?');

        if (userConfirmed) {
            console.log('User clicked OK');
            const response = await axios.delete(`http://localhost:3000/request/${requestId}`);
            alert(response.data);
            window.location.reload();
        } else {
            console.log('User clicked Cancel');
        }
    } 

    return (
        <>
        <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="px-4 py-2">{data.indexOf(item)+1}</td>
            <td className="px-4 py-2 font-bold">{item.type}</td>
            {isAdmin && <td className="px-4 py-2">{item.name}</td>}
            <td className="px-4 py-2">{item.preferredDate + " " + item.preferredTime}</td>
            <td className="px-4 py-2">
                <span className={`px-2 py-1 rounded text-white 
                    ${item.status === "PENDING" ? "bg-yellow-500" : 
                        item.status === "ACCEPTED" ? "bg-green-500" : 
                        item.status === "REJECTED" ? "bg-red-500" :
                        "bg-blue-400" }`}>
                {item.status}
                </span>
            </td>
            {!isAdmin && (<td className="px-4 py-2">
                <PencilIcon className="w-5 h-5 ml-2 text-stone-600" onClick={handleEdit}/>
            </td>)}
            
            {!isAdmin && (<td className="px-4 py-2">
                    <TrashIcon className="w-5 h-5 ml-2 text-red-500" onClick={handleDelete} />
            </td>)}

            {isAdmin && (<td className="px-4 py-2">
                <button 
                    className="px-2 py-1 bg-blue-500 text-white font-regular rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                    onClick={handleReview}
                >
                Review</button>
            </td>)}
        </tr>
    </>
    );
}