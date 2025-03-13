import { UserCog } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

// Tambahkan link ini di dalam sidebar untuk admin
const Sidebar = () => {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <>
      {user?.role === "superadmin" && (
        <li>
          <Link
            href="/admin/manage-logins"
            className="flex items-center p-2 hover:bg-gray-100 rounded-md"
          >
            <UserCog className="h-5 w-5 mr-2" />
            <span>Manage Logins</span>
          </Link>
        </li>
      )}
    </>
  );
};

export default Sidebar;
