import React from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

const kycRequests = [
  {
    id: '1',
    user: 'John Doe',
    email: 'john@example.com',
    status: 'pending',
    documents: ['Passport', 'Proof of Address'],
    submittedAt: '2024-03-15 10:30',
  },
  {
    id: '2',
    user: 'Alice Smith',
    email: 'alice@example.com',
    status: 'approved',
    documents: ['Driver License', 'Utility Bill'],
    submittedAt: '2024-03-15 09:45',
  },
  {
    id: '3',
    user: 'Bob Johnson',
    email: 'bob@example.com',
    status: 'rejected',
    documents: ['ID Card', 'Bank Statement'],
    submittedAt: '2024-03-15 08:15',
  },
];

export default function CompliancePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Compliance</h1>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
          <Shield className="w-5 h-5" />
          <span>Compliance Status: Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Reviews</p>
              <p className="text-xl font-semibold">12</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">High Risk Users</p>
              <p className="text-xl font-semibold">5</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Approved Today</p>
              <p className="text-xl font-semibold">8</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">KYC Requests</h2>
          <p className="text-gray-500 mt-1">Review and manage KYC verification requests</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="px-6 py-3 text-gray-500 font-medium">User</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Email</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Documents</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Status</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Submitted At</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {kycRequests.map((request) => (
                <tr key={request.id} className="border-b border-gray-100">
                  <td className="px-6 py-4">{request.user}</td>
                  <td className="px-6 py-4">{request.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {request.documents.map((doc) => (
                        <span
                          key={doc}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          {doc}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        request.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : request.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{request.submittedAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded">
                        Approve
                      </button>
                      <button className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded">
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}