'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  ChevronDown,
  Eye,
  Trash2,
  Check,
  X,
  Loader,
  Filter,
} from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const ApplicationStatusBadge = ({ status }) => {
  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const ApplicationTypeBadge = ({ type }) => {
  return (
    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
      {type === 'individual' ? 'Individual' : 'Corporate'}
    </span>
  );
};

const DetailModal = ({ application, onClose, onApprove, onReject }) => {
  const [notes, setNotes] = useState(application?.notes || '');
  const [approveNotes, setApproveNotes] = useState('');
  const [rejectNotes, setRejectNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!application) return null;

  const isIndividual = application.type === 'individual';

  const handleApprove = async () => {
    setIsSubmitting(true);
    await onApprove(application._id, approveNotes);
    setIsSubmitting(false);
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    await onReject(application._id, rejectNotes);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex justify-between items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold">Application Details</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-sm text-gray-600">Type</label>
                <p className="font-medium">
                  {isIndividual ? 'Individual' : 'Corporate'}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Status</label>
                <div className="mt-1">
                  <ApplicationStatusBadge status={application.status} />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <p className="font-medium">{application.emailAddress}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Phone</label>
                <p className="font-medium">{application.phoneNumber}</p>
              </div>
            </div>
          </div>

          {/* Individual Specific */}
          {isIndividual && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">First Name</label>
                  <p className="font-medium">{application.firstName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Last Name</label>
                  <p className="font-medium">{application.lastName}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-600">Home Address</label>
                  <p className="font-medium">{application.homeAddress}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Years at Address</label>
                  <p className="font-medium">{application.yearsAtAddress}</p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-4">References</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                    <div>
                      <label className="text-sm text-gray-600">Reference 1</label>
                      <p className="font-medium">{application.reference1Name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Phone</label>
                      <p className="font-medium">{application.reference1Phone}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                    <div>
                      <label className="text-sm text-gray-600">Reference 2</label>
                      <p className="font-medium">{application.reference2Name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Phone</label>
                      <p className="font-medium">{application.reference2Phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Corporate Specific */}
          {!isIndividual && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Company Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm text-gray-600">Company Name</label>
                  <p className="font-medium">{application.companyName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">RC Number</label>
                  <p className="font-medium">{application.rcNumber}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Representative Role
                  </label>
                  <p className="font-medium">
                    {application.representativePosition}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-600">Company Address</label>
                  <p className="font-medium">{application.companyAddress}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-600">
                    Representative Name
                  </label>
                  <p className="font-medium">{application.representativeName}</p>
                </div>
              </div>
            </div>
          )}

          {/* Common Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
            <div>
              <label className="text-sm text-gray-600">How did you hear about us?</label>
              <p className="font-medium">{application.howHeardAboutUs}</p>
            </div>
          </div>

          {/* Current Notes */}
          {application.notes && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Admin Notes</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded">
                {application.notes}
              </p>
            </div>
          )}

          {/* Submission Date */}
          <div className="text-sm text-gray-600 border-t pt-4">
            <p>
              Submitted on{' '}
              {new Date(application.createdAt).toLocaleDateString('en-NG', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {/* Actions */}
          {application.status === 'pending' && (
            <div className="border-t pt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Approval Notes (Optional)
                </label>
                <textarea
                  value={approveNotes}
                  onChange={(e) => setApproveNotes(e.target.value)}
                  placeholder="Add notes for approval..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader size={18} className="animate-spin" /> : <Check size={18} />}
                Approve Application
              </button>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason (Optional)
                </label>
                <textarea
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  placeholder="Add reason for rejection..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleReject}
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader size={18} className="animate-spin" /> : <X size={18} />}
                Reject Application
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function ManagePartnerApplications() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
  });

  // Fetch applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.type !== 'all') params.append('type', filters.type);
      if (filters.status !== 'all') params.append('status', filters.status);

      const response = await fetch(`/api/partner-applications?${params}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (data.success) {
        setApplications(data.applications || []);
      } else {
        toast.error('Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Error fetching applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [filters]);

  // Delete application
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) {
      return;
    }

    try {
      const response = await fetch(`/api/partner-applications?id=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Application deleted');
        setApplications(applications.filter((app) => app._id !== id));
      } else {
        toast.error('Failed to delete application');
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.error('Error deleting application');
    }
  };

  // Update status
  const handleApprove = async (id, notes) => {
    try {
      const response = await fetch('/api/partner-applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: 'approved',
          notes,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Application approved');
        setApplications(
          applications.map((app) =>
            app._id === id ? { ...app, status: 'approved', notes } : app
          )
        );
        setSelectedApplication(null);
      } else {
        toast.error('Failed to approve application');
      }
    } catch (error) {
      console.error('Error approving application:', error);
      toast.error('Error approving application');
    }
  };

  const handleReject = async (id, notes) => {
    try {
      const response = await fetch('/api/partner-applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: 'rejected',
          notes,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Application rejected');
        setApplications(
          applications.map((app) =>
            app._id === id ? { ...app, status: 'rejected', notes } : app
          )
        );
        setSelectedApplication(null);
      } else {
        toast.error('Failed to reject application');
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error('Error rejecting application');
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 md:mb-8">Partner Applications</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <Filter size={18} className="text-gray-600 mt-1 flex-shrink-0" />

          <div className="w-full sm:w-auto">
            <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-impact-gold focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="individual">Individual</option>
              <option value="corporate">Corporate</option>
            </select>
          </div>

          <div className="w-full sm:w-auto">
            <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-impact-gold focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table / Cards */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 flex items-center justify-center">
          <Loader size={32} className="text-impact-gold animate-spin" />
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
          <p className="text-sm sm:text-base text-gray-600">No applications found</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">
                      Name / Company
                    </th>
                    <th className="hidden md:table-cell px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">
                      Type
                    </th>
                    <th className="hidden xl:table-cell px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="hidden sm:table-cell px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm">
                        <p className="font-medium text-gray-900">
                          {app.type === 'individual'
                            ? `${app.firstName} ${app.lastName}`
                            : app.companyName}
                        </p>
                      </td>
                      <td className="hidden md:table-cell px-4 sm:px-6 py-4 text-xs sm:text-sm">
                        <ApplicationTypeBadge type={app.type} />
                      </td>
                      <td className="hidden xl:table-cell px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-600">
                        {app.emailAddress}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm">
                        <ApplicationStatusBadge status={app.status} />
                      </td>
                      <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-600">
                        {new Date(app.createdAt).toLocaleDateString('en-NG')}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm flex items-center gap-2 sm:gap-3">
                        <button
                          onClick={() => setSelectedApplication(app)}
                          className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(app._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {applications.map((app) => (
              <div key={app._id} className="bg-white rounded-lg shadow-sm p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <p className="font-medium text-sm sm:text-base text-gray-900">
                      {app.type === 'individual'
                        ? `${app.firstName} ${app.lastName}`
                        : app.companyName}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {app.emailAddress}
                    </p>
                  </div>
                  <ApplicationStatusBadge status={app.status} />
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <ApplicationTypeBadge type={app.type} />
                  <span className="text-xs sm:text-sm text-gray-600">
                    {new Date(app.createdAt).toLocaleDateString('en-NG')}
                  </span>
                </div>

                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={() => setSelectedApplication(app)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs sm:text-sm font-medium"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(app._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs sm:text-sm font-medium"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Detail Modal */}
      {selectedApplication && (
        <DetailModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}

export default function Page() {
  return (
    <ProtectedRoute requiredRoles={['admin', 'staff-member']}>
      <ManagePartnerApplications />
    </ProtectedRoute>
  );
}
