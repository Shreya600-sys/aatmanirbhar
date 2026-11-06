import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateService } from "../../hooks/useCreateService";
import { useAuth } from "../../context/AuthContext";
import ServiceForm from "../../features/services/components/ServiceForm";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";

const CreateServicePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const createServiceMutation = useCreateService();

  // Ask for a phone number only if the entrepreneur hasn't added one yet
  const [askForPhone] = useState(!user?.phoneNumber);

  const handleCreate = (payload) => {
    createServiceMutation.mutate(payload, {
      onSuccess: () => {
        if (payload.phoneNumber) {
          updateUser({ phoneNumber: payload.phoneNumber });
        }
        toast.success("Service published successfully!");
        navigate("/dashboard/services");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to create service.");
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12">
      <div className="mb-10 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 hover:bg-gray-100 rounded-full transition-colors border border-transparent hover:border-gray-200"
        >
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create New Service</h1>
          <p className="text-gray-500 mt-2 text-lg">Share your skills and products with customers near you.</p>
        </div>
      </div>

      <ServiceForm
        onSubmit={handleCreate}
        isSubmitting={createServiceMutation.isPending}
        submitLabel="Publish Service"
        askForPhone={askForPhone}
      />
    </div>
  );
};

export default CreateServicePage;
