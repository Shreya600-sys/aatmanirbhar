import { useNavigate, useParams } from "react-router-dom";
import { useService } from "../../hooks/useService";
import { useUpdateService } from "../../hooks/useUpdateService";
import ServiceForm from "../../features/services/components/ServiceForm";
import { Loader2, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";

const EditServicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: service, isLoading } = useService(id);
  const updateServiceMutation = useUpdateService();

  const handleUpdate = (payload) => {
    updateServiceMutation.mutate(
      { serviceId: id, data: payload },
      {
        onSuccess: () => {
          toast.success("Service updated successfully!");
          navigate("/dashboard/services");
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to update service.");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-gray-500 font-medium">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return <p className="text-center py-20 text-gray-500">Service not found.</p>;
  }

  const defaultValues = {
    name: service.name,
    description: service.description,
    price: service.price,
    duration: service.duration,
    category: service.category?._id || service.category,
    address: service.address || "",
    imageUrls: (service.images || []).join("\n"),
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
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Edit Service</h1>
          <p className="text-gray-500 mt-2 text-lg">Update your service details and pricing.</p>
        </div>
      </div>

      <ServiceForm
        defaultValues={defaultValues}
        onSubmit={handleUpdate}
        isSubmitting={updateServiceMutation.isPending}
        submitLabel="Save Changes"
      />
    </div>
  );
};

export default EditServicePage;
