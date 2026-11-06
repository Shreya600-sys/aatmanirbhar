import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { useUpdateProfile } from "../../hooks/useUpdateProfile";
import { User, Mail, Lock, Save, Loader2, Phone } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";

const SettingsPage = () => {
  const { user } = useAuth();
  const updateProfileMutation = useUpdateProfile();

  const { register, handleSubmit, reset, watch, formState: { isDirty, errors } } = useForm();

  const newPasswordValue = watch("password");

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        bio: user.bio || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user, reset]);

  const onSubmit = (data) => {
    const payload = {
      name: data.name,
      bio: data.bio,
      phoneNumber: data.phoneNumber,
    };

    if (data.password) {
      payload.password = data.password;
      payload.currentPassword = data.currentPassword;
    }

    updateProfileMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Profile updated successfully!");
        reset({ ...data, currentPassword: "", password: "" });
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to update profile");
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-500 mt-2">Manage your profile and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center sticky top-24">

            <div className="inline-block mb-4">
              <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 mx-auto">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400 bg-gray-50">
                    <User size={48} />
                  </div>
                )}
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-sm text-gray-500 mb-4 capitalize">{user?.role}</p>

            <div className="text-xs text-gray-400 bg-gray-50 py-2 px-4 rounded-full inline-block">
              Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

            <div className="p-8 space-y-6">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">
                Profile Details
              </h3>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    {...register("name")}
                    type="text"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    {...register("phoneNumber", {
                      pattern: {
                        value: /^[0-9+\-\s()]*$/,
                        message: "Invalid phone number format"
                      }
                    })}
                    type="tel"
                    placeholder="+91 9876543210"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <div className="relative opacity-60 cursor-not-allowed">
                  <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    {...register("email")}
                    type="email"
                    disabled
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5 ml-1">Email cannot be changed.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Bio / About Me</label>
                <textarea
                  {...register("bio")}
                  rows={4}
                  placeholder="Tell customers about yourself and your business..."
                  className="w-full p-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-gray-50 focus:bg-white resize-y"
                />
              </div>

              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 pt-4">
                Security
              </h3>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    {...register("currentPassword", { 
                      required: newPasswordValue ? "Current password is required to set a new one" : false 
                    })}
                    type="password"
                    placeholder="Enter current password if changing it"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
                {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    {...register("password", { 
                      minLength: { value: 6, message: "Min 6 chars" } 
                    })}
                    type="password"
                    placeholder="Leave blank to keep current password"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
                 {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>
            </div>

            <div className="bg-gray-50 px-8 py-5 border-t border-gray-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={updateProfileMutation.isPending || !isDirty}
                className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} /> Save Changes
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;