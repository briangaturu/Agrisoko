import { Users, ShoppingBag, Package, Sprout } from "lucide-react";
import { useGetAllUsersQuery } from "../features/api/userApi";
import { useGetOrdersQuery } from "../features/api/ordersApi";
import { useGetListingsQuery } from "../features/api/listingsApi";
import { useGetCropsQuery } from "../features/api/cropApi";

const Analytics = () => {
  const { data: usersData    } = useGetAllUsersQuery({});
  const { data: ordersData   } = useGetOrdersQuery({});
  const { data: listingsData } = useGetListingsQuery({});
  const { data: cropsData    } = useGetCropsQuery({});

  const users    : any[] = usersData?.data    ?? [];
  const orders   : any[] = ordersData?.data   ?? [];
  const listings : any[] = listingsData?.data ?? [];
  const crops    : any[] = cropsData?.data    ?? [];

  const cards = [
    { label: "Total Users",    value: users.length,    icon: Users,       color: "text-blue-400",   bg: "bg-blue-500/10   border-blue-500/20"   },
    { label: "Total Orders",   value: orders.length,   icon: ShoppingBag, color: "text-amber-400",  bg: "bg-amber-500/10  border-amber-500/20"  },
    { label: "Total Listings", value: listings.length, icon: Package,     color: "text-green-400",  bg: "bg-green-500/10  border-green-500/20"  },
    { label: "Total Crops",    value: crops.length,    icon: Sprout,      color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Analytics Overview</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`rounded-xl border p-5 ${bg}`}>
            <Icon size={20} className={`${color} mb-3`} />
            <p className="text-gray-400 text-xs mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;