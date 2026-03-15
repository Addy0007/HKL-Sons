import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  User, MapPin, Lock, ShoppingBag, Edit2, Check, X,
  Plus, Trash2, ChevronRight, Package, IndianRupee,
  Calendar, Eye, EyeOff,
} from "lucide-react";
import api from "../../../Config/apiConfig";
import { getUser } from "../../../State/Auth/Action";

const initials = (u) =>
  u ? `${u.firstName?.charAt(0) ?? ""}${u.lastName?.charAt(0) ?? ""}`.toUpperCase() ||
      u.email?.charAt(0)?.toUpperCase() || "U" : "U";

const fullName = (u) =>
  u ? [u.firstName, u.lastName].filter(Boolean).join(" ") || "User" : "User";

// ─── SectionCard ─────────────────────────────────────────────────────────────
function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-[#F6F3EC] rounded-2xl border border-[#C6A15B]/30 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#C6A15B]/20 bg-[#EDE9E0]">
        <div className="p-2 bg-[#C6A15B]/10 rounded-lg">
          <Icon size={18} className="text-[#C6A15B]" />
        </div>
        <h2 className="font-semibold text-[#2C2C2C] text-sm sm:text-base">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Field({ label, value, editing, name, onChange, type = "text", readOnly = false }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#C6A15B] mb-1">{label}</label>
      {editing && !readOnly ? (
        <input
          type={type} name={name} value={value ?? ""} onChange={onChange}
          className="w-full px-3 py-2 rounded-lg border border-[#C6A15B]/40 text-sm text-[#2C2C2C] bg-[#F6F3EC] focus:outline-none focus:ring-2 focus:ring-[#1F3D2B] focus:border-[#1F3D2B]"
        />
      ) : (
        <p className="text-sm text-[#2C2C2C] py-2 px-3 bg-[#EDE9E0] rounded-lg min-h-[36px]">
          {value || <span className="text-[#3D3D3D] italic">Not set</span>}
        </p>
      )}
    </div>
  );
}

// ─── PERSONAL INFO ────────────────────────────────────────────────────────────
function PersonalInfo({ user, onSave }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    setForm({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      mobile: user?.mobile ?? "",
    });
  }, [user]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      await api.put("/api/users/profile", {
        firstName: form.firstName,
        lastName: form.lastName,
        mobile: form.mobile,
      });
      setMsg({ type: "success", text: "Profile updated successfully." });
      setEditing(false);
      onSave?.();
      setTimeout(() => setMsg(null), 3000);
    } catch (err) {
      setMsg({ type: "error", text: err?.response?.data?.message || "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionCard title="Personal Information" icon={User}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="First Name" name="firstName" value={form.firstName} editing={editing} onChange={handleChange} />
        <Field label="Last Name" name="lastName" value={form.lastName} editing={editing} onChange={handleChange} />
        <Field label="Email Address" name="email" value={form.email} editing={editing} readOnly />
        <Field label="Phone Number" name="mobile" value={form.mobile} editing={editing} onChange={handleChange} type="tel" />
      </div>

      {msg && (
        <p className={`mt-4 text-sm px-3 py-2 rounded-lg font-medium ${
          msg.type === "success"
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {msg.text}
        </p>
      )}

      <div className="mt-5 flex items-center gap-3">
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors hover:opacity-90"
            style={{ backgroundColor: "#1F3D2B" }}
          >
            <Edit2 size={14} /> Edit Profile
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-60 hover:opacity-90"
              style={{ backgroundColor: "#1F3D2B" }}
            >
              {saving
                ? <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Check size={14} />}
              Save Changes
            </button>
            <button
              onClick={() => { setEditing(false); setMsg(null); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#C6A15B]/40 hover:bg-[#C6A15B]/10 text-[#2C2C2C] text-sm font-medium transition-colors"
            >
              <X size={14} /> Cancel
            </button>
          </>
        )}
      </div>

      <p className="mt-4 text-xs text-[#3D3D3D]">
        Member since{" "}
        {user?.createdAt
          ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
          : "—"}
      </p>
    </SectionCard>
  );
}

// ─── SAVED ADDRESSES ──────────────────────────────────────────────────────────
function SavedAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [loadingAddr, setLoadingAddr] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [msg, setMsg] = useState(null);

  const emptyForm = {
    firstName: "", lastName: "", streetAddress: "",
    city: "", district: "", state: "", zipCode: "", mobile: "",
  };
  const [form, setForm] = useState(emptyForm);

  const loadAddresses = async () => {
    try {
      const { data } = await api.get("/api/address");
      setAddresses(Array.isArray(data) ? data.filter((a) => a.active !== false) : []);
    } catch {
      setAddresses([]);
    } finally {
      setLoadingAddr(false);
    }
  };

  useEffect(() => { loadAddresses(); }, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleAdd = async () => {
    if (!form.firstName || !form.streetAddress || !form.zipCode || !form.mobile) {
      setMsg({ type: "error", text: "First name, street address, PIN code and phone are required." });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      await api.post("/api/address", form);
      setShowForm(false);
      setForm(emptyForm);
      setMsg({ type: "success", text: "Address saved successfully." });
      await loadAddresses();
      setTimeout(() => setMsg(null), 3000);
    } catch {
      setMsg({ type: "error", text: "Failed to save address. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    setDeleting(id);
    try {
      await api.delete(`/api/address/${id}`);
      await loadAddresses();
    } catch {
      setMsg({ type: "error", text: "Failed to delete address." });
    } finally {
      setDeleting(null);
    }
  };

  const formFields = [
    { name: "firstName", label: "First Name *" },
    { name: "lastName", label: "Last Name" },
    { name: "streetAddress", label: "Street Address *", span: true },
    { name: "city", label: "City *" },
    { name: "district", label: "District" },
    { name: "state", label: "State *" },
    { name: "zipCode", label: "PIN Code *" },
    { name: "mobile", label: "Phone *" },
  ];

  return (
    <SectionCard title="Saved Addresses" icon={MapPin}>
      {msg && (
        <p className={`mb-4 text-sm px-3 py-2 rounded-lg font-medium ${
          msg.type === "success"
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {msg.text}
        </p>
      )}

      {loadingAddr ? (
        <div className="flex items-center gap-2 text-sm text-[#3D3D3D]">
          <span className="h-4 w-4 border-2 border-[#C6A15B] border-t-transparent rounded-full animate-spin" />
          Loading addresses...
        </div>
      ) : (
        <>
          {addresses.length === 0 && !showForm && (
            <p className="text-sm text-[#3D3D3D] italic mb-4">No saved addresses yet.</p>
          )}

          <div className="space-y-3 mb-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="flex items-start justify-between p-4 rounded-xl border border-[#C6A15B]/20 bg-[#EDE9E0]"
              >
                <div className="text-sm text-[#2C2C2C] leading-relaxed">
                  <p className="font-semibold">{addr.firstName} {addr.lastName}</p>
                  <p>{addr.streetAddress}</p>
                  <p>{addr.city}{addr.district ? `, ${addr.district}` : ""}, {addr.state} — {addr.zipCode}</p>
                  {addr.mobile && (
                    <p className="text-[#3D3D3D] text-xs mt-1">📞 {addr.mobile}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(addr.id)}
                  disabled={deleting === addr.id}
                  className="ml-4 p-2 text-[#C6A15B] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40 flex-shrink-0"
                >
                  {deleting === addr.id
                    ? <span className="h-4 w-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin block" />
                    : <Trash2 size={16} />}
                </button>
              </div>
            ))}
          </div>

          {showForm ? (
            <div className="border border-[#C6A15B]/30 bg-[#C6A15B]/5 rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-[#2C2C2C]">New Address</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formFields.map(({ name, label, span }) => (
                  <div key={name} className={span ? "sm:col-span-2" : ""}>
                    <label className="block text-xs font-medium text-[#C6A15B] mb-1">{label}</label>
                    <input
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-[#C6A15B]/40 text-sm text-[#2C2C2C] bg-[#F6F3EC] focus:outline-none focus:ring-2 focus:ring-[#1F3D2B]"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleAdd}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60 hover:opacity-90"
                  style={{ backgroundColor: "#1F3D2B" }}
                >
                  {saving
                    ? <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <Check size={14} />}
                  Save Address
                </button>
                <button
                  onClick={() => { setShowForm(false); setForm(emptyForm); setMsg(null); }}
                  className="flex items-center gap-2 px-4 py-2 border border-[#C6A15B]/40 hover:bg-[#C6A15B]/10 text-[#2C2C2C] rounded-lg text-sm font-medium transition-colors"
                >
                  <X size={14} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-[#C6A15B]/50 hover:border-[#C6A15B] hover:bg-[#C6A15B]/10 text-[#C6A15B] text-sm font-medium transition-colors"
            >
              <Plus size={16} /> Add New Address
            </button>
          )}
        </>
      )}
    </SectionCard>
  );
}

// ─── CHANGE PASSWORD ──────────────────────────────────────────────────────────
function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (form.newPassword !== form.confirmPassword) {
      setMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (form.newPassword.length < 6) {
      setMsg({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      await api.put("/api/users/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setMsg({ type: "success", text: "Password changed successfully." });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setMsg({ type: "error", text: err?.response?.data?.message || "Failed. Check your current password." });
    } finally {
      setSaving(false);
    }
  };

  const pwFields = [
    { name: "currentPassword", label: "Current Password", showKey: "current" },
    { name: "newPassword", label: "New Password", showKey: "new" },
    { name: "confirmPassword", label: "Confirm New Password", showKey: "confirm" },
  ];

  return (
    <SectionCard title="Change Password" icon={Lock}>
      <div className="max-w-sm space-y-4">
        {pwFields.map(({ name, label, showKey }) => (
          <div key={name}>
            <label className="block text-xs font-medium text-[#C6A15B] mb-1">{label}</label>
            <div className="relative">
              <input
                type={show[showKey] ? "text" : "password"}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3 py-2 pr-10 rounded-lg border border-[#C6A15B]/40 text-sm text-[#2C2C2C] bg-[#F6F3EC] focus:outline-none focus:ring-2 focus:ring-[#1F3D2B] focus:border-[#1F3D2B]"
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, [showKey]: !s[showKey] }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C6A15B] hover:text-[#a8843d]"
              >
                {show[showKey] ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        ))}

        {msg && (
          <p className={`text-sm px-3 py-2 rounded-lg font-medium ${
            msg.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {msg.text}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={saving || !form.currentPassword || !form.newPassword || !form.confirmPassword}
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60 hover:opacity-90"
          style={{ backgroundColor: "#1F3D2B" }}
        >
          {saving
            ? <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <Lock size={14} />}
          Update Password
        </button>
        <p className="text-xs text-[#3D3D3D]">
          Use at least 6 characters. Mix letters and numbers for security.
        </p>
      </div>
    </SectionCard>
  );
}

// ─── ORDER STATS ──────────────────────────────────────────────────────────────
function OrderStats({ orders, loading }) {
  const navigate = useNavigate();

  const total = orders?.length ?? 0;
  const delivered = orders?.filter((o) => o.orderStatus === "DELIVERED").length ?? 0;
  const cancelled = orders?.filter((o) => o.orderStatus === "CANCELLED").length ?? 0;
  const totalSpent = orders
    ?.filter((o) => o.orderStatus === "DELIVERED")
    .reduce((sum, o) => sum + (o.totalDiscountedPrice ?? o.totalPrice ?? 0), 0) ?? 0;

  const stats = [
    { label: "Total Orders", value: total, icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
    { label: "Delivered", value: delivered, icon: Package, color: "bg-green-50 text-green-600" },
    { label: "Cancelled", value: cancelled, icon: X, color: "bg-red-50 text-red-600" },
    { label: "Total Spent", value: `₹${totalSpent.toLocaleString("en-IN")}`, icon: IndianRupee, color: "bg-[#C6A15B]/10 text-[#C6A15B]" },
  ];

  const statusBadge = {
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    SHIPPED: "bg-blue-100 text-blue-700",
    OUT_FOR_DELIVERY: "bg-[#1F3D2B]/10 text-[#1F3D2B]",
    CONFIRMED: "bg-purple-100 text-purple-700",
    PLACED: "bg-[#EDE9E0] text-[#2C2C2C]",
    PENDING: "bg-yellow-100 text-yellow-700",
    RETURNED: "bg-orange-100 text-orange-700",
  };

  const recent = orders?.slice(0, 3) ?? [];

  return (
    <SectionCard title="Order Statistics" icon={ShoppingBag}>
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-[#3D3D3D]">
          <span className="h-4 w-4 border-2 border-[#C6A15B] border-t-transparent rounded-full animate-spin" />
          Loading orders...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {stats.map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="rounded-xl border border-[#C6A15B]/20 bg-[#EDE9E0] p-4 flex flex-col gap-2"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
                  <Icon size={18} />
                </div>
                <p className="text-xl font-bold text-[#2C2C2C]">{value}</p>
                <p className="text-xs text-[#3D3D3D]">{label}</p>
              </div>
            ))}
          </div>

          {recent.length > 0 && (
            <>
              <h3 className="text-sm font-semibold text-[#2C2C2C] mb-3">Recent Orders</h3>
              <div className="space-y-2">
                {recent.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => navigate(`/account/order/${order.id}`)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-[#C6A15B]/20 hover:border-[#C6A15B]/50 hover:bg-[#C6A15B]/5 transition-colors text-left group"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#2C2C2C]">
                        #{order.id}
                        {order.orderItems?.[0]?.productName && (
                          <span className="text-[#3D3D3D] font-normal ml-2 text-xs">
                            — {order.orderItems[0].productName}
                            {order.orderItems.length > 1 && ` +${order.orderItems.length - 1} more`}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-[#3D3D3D] mt-0.5 flex items-center gap-1">
                        <Calendar size={11} />
                        {order.orderDate
                          ? new Date(order.orderDate).toLocaleDateString("en-IN", {
                              day: "2-digit", month: "short", year: "numeric",
                            })
                          : "—"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        statusBadge[order.orderStatus] ?? "bg-[#EDE9E0] text-[#2C2C2C]"
                      }`}>
                        {order.orderStatus?.replaceAll("_", " ")}
                      </span>
                      <span className="text-sm font-semibold text-[#2C2C2C]">
                        ₹{order.totalDiscountedPrice ?? order.totalPrice}
                      </span>
                      <ChevronRight size={16} className="text-[#C6A15B] group-hover:text-[#a8843d] transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => navigate("/account/order")}
                className="mt-4 text-sm text-[#C6A15B] hover:text-[#a8843d] font-medium flex items-center gap-1 transition-colors"
              >
                View all orders <ChevronRight size={14} />
              </button>
            </>
          )}
          {recent.length === 0 && (
            <p className="text-sm text-[#3D3D3D] italic">No orders placed yet.</p>
          )}
        </>
      )}
    </SectionCard>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jwt, user } = useSelector((state) => state.auth);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!jwt) navigate("/login");
  }, [jwt, navigate]);

  useEffect(() => {
    if (!jwt) return;
    api.get("/api/orders/user")
      .then(({ data }) => setOrders(data))
      .catch(() => {})
      .finally(() => setOrdersLoading(false));
  }, [jwt]);

  const refreshUser = () => { if (jwt) dispatch(getUser(jwt)); };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F3EC]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C6A15B]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F3EC]">
      {/* Hero */}
      <div
        className="px-4 sm:px-6 lg:px-8 py-10"
        style={{ background: "linear-gradient(to right, #162d1f, #1F3D2B)" }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center sm:items-end gap-5">
          <div className="w-20 h-20 rounded-2xl bg-[#F6F3EC] text-[#1F3D2B] flex items-center justify-center text-3xl font-bold shadow-lg flex-shrink-0">
            {initials(user)}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-white">{fullName(user)}</h1>
            <p className="text-[#D8C7A3] text-sm mt-0.5">{user.email}</p>
            {user.mobile && (
              <p className="text-[#C6A15B] text-xs mt-0.5">📞 {user.mobile}</p>
            )}
          </div>
          <div className="sm:ml-auto flex gap-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-center border border-white/20">
              <p className="text-xl font-bold text-white">{orders.length}</p>
              <p className="text-[#D8C7A3] text-xs">Orders</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-center border border-white/20">
              <p className="text-lg font-bold text-white">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                      month: "short", year: "numeric",
                    })
                  : "—"}
              </p>
              <p className="text-[#D8C7A3] text-xs">Member Since</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <PersonalInfo user={user} onSave={refreshUser} />
        <OrderStats orders={orders} loading={ordersLoading} />
        <SavedAddresses />
        <ChangePassword />
      </div>
    </div>
  );
}