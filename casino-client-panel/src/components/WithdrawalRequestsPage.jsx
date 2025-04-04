import React, { useEffect, useState } from 'react';
import { Download, Filter, CheckCircle, XCircle, Clock } from 'lucide-react';
import FilterDialog from './FilterDialog';
import { useDispatch, useSelector } from 'react-redux';
import { withdrawalsApi } from '../store/global.Action';



export default function WithdrawalRequestsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const token = useSelector(state => state.global.profile.token)
  const casinoId = useSelector(state => state.global.profile.user.casinoId)
  const withdrawals = useSelector(state => state.global.withdrawals);
  const filterFields = [
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' },
      ],
    },
    {
      name: 'priority',
      label: 'Priority',
      type: 'select',
      options: [
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
      ],
    },
    {
      name: 'date',
      label: 'Date',
      type: 'date',
    },
    {
      name: 'amount',
      label: 'Minimum Amount (USD)',
      type: 'number',
    },
  ];
  const filteredRequests = withdrawals.filter((request) => {
    if (activeFilters.status && request.status !== activeFilters.status) return false;
    if (activeFilters.priority && request.priority !== activeFilters.priority) return false;
    if (activeFilters.date && request.timestamp.split(' ')[0] !== activeFilters.date) return false;
    if (activeFilters.amount && parseFloat(request.fiatValue.replace('$', '').replace(',', '')) < activeFilters.amount) return false;
    return true;
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(withdrawalsApi({ token: token, casinoId: casinoId }))
  }, [])


  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Withdrawal Requests</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            {Object.keys(activeFilters).length > 0 ? `Filters (${Object.keys(activeFilters).length})` : 'Filter'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Requests</p>
              <p className="text-xl font-semibold">8</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-xl font-semibold">12</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-xl font-semibold">3</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="px-6 py-3 text-gray-500 font-medium">Request ID</th>
                <th className="px-6 py-3 text-gray-500 font-medium">User Id</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Amount</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Fiat Value</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Wallet Address</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Status</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Timestamp</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm">{request?.
                  _id?.length > 10
                      ? `${request?.userId?.slice(0, 3)}...${request?._id?.slice(-3)}`
                      : request?.userId}</td>
                  <td className="px-6 py-4">{request?.userId?.length > 10
                      ? `${request?.userId?.slice(0, 3)}...${request?.userId?.slice(-3)}`
                      : request?.userId}</td>
                  <td className="px-6 py-4 font-medium">{request.amount}</td>
                  <td className="px-6 py-4 text-gray-600">{request.amount*87}</td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm">{request.wallet}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${request.status === 'completed' 
                        ? 'bg-green-100 text-green-700'
                        : request.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                        }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{new Date(request.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    {request.status === 'pending' ? <div className="flex gap-2">
                      <button
                        className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded"
                        disabled={request.status !== 'pending'}
                      >
                        Approve
                      </button>
                      <button
                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                        disabled={request.status !== 'pending'}
                      >
                        Reject
                      </button>
                    </div>:<span
                      className={`px-2 py-1 rounded-full text-xs ${request.status === 'completed' 
                        ? 'bg-green-100 text-green-700'
                        : request.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                        }`}
                    >
                      {request.status}
                    </span>}
                   
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <FilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={setActiveFilters}
        fields={filterFields}
      />
    </div>
  );
}