import React, { useState } from 'react';
import { Download, Filter, CheckCircle, XCircle, Clock, AlertTriangle, Eye, Search } from 'lucide-react';
import FilterDialog from './FilterDialog';

// Sample data - expanded with more examples
const withdrawalRequests = [
  {
    id: 'W123',
    user: 'Ba..F1z',
    amount: '2.5 USDT',
    fiatValue: '$125,000',
    wallet: '0x0e170E7Efe1458fe9049ACeC8B4433b79a0A7DBB',
    status: 'pending',
    timestamp: '2024-03-15 14:30',
    priority: 'high',
  },
  {
    id: 'W124',
    user: 'Tx..9Qr',
    amount: '1.2 ETH',
    fiatValue: '$2,800',
    wallet: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    status: 'pending',
    timestamp: '2024-03-15 15:45',
    priority: 'medium',
  },
  {
    id: 'W125',
    user: 'Kz..7Lp',
    amount: '0.5 BTC',
    fiatValue: '$31,500',
    wallet: '0x8901cB8a5824F2599e4644f1B7Af5389957833c9',
    status: 'approved',
    timestamp: '2024-03-14 09:20',
    priority: 'high',
  }
];

export default function WithdrawalRequestsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, type: null, request: null });
  const [viewRequest, setViewRequest] = useState(null);

  // Filter fields with improved options
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
      name: 'dateRange',
      label: 'Date Range',
      type: 'dateRange',
      startName: 'startDate',
      endName: 'endDate',
    },
    {
      name: 'amountRange',
      label: 'Amount Range (USD)',
      type: 'range',
      minName: 'minAmount',
      maxName: 'maxAmount',
    },
  ];

  // Process a withdrawal request
  const processRequest = (request, action) => {
    console.log(`${action} request ${request.id}`);
    // Here you would make an API call to update the status
    setConfirmDialog({ isOpen: false, type: null, request: null });
    
    // In a real application, you would update the state after a successful API call
    // This is just a demo to show the UI flow
  };

  // Filter logic with search capability
  const filteredRequests = withdrawalRequests.filter((request) => {
    // Search filter
    if (searchTerm && !Object.values(request).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    // Status filter
    if (activeFilters.status && request.status !== activeFilters.status) return false;
    
    // Priority filter
    if (activeFilters.priority && request.priority !== activeFilters.priority) return false;
    
    // Date range filter
    if (activeFilters.startDate || activeFilters.endDate) {
      const requestDate = new Date(request.timestamp.split(' ')[0]);
      if (activeFilters.startDate && new Date(activeFilters.startDate) > requestDate) return false;
      if (activeFilters.endDate && new Date(activeFilters.endDate) < requestDate) return false;
    }
    
    // Amount range filter
    const amount = parseFloat(request.fiatValue.replace('$', '').replace(',', ''));
    if (activeFilters.minAmount && amount < activeFilters.minAmount) return false;
    if (activeFilters.maxAmount && amount > activeFilters.maxAmount) return false;
    
    return true;
  });

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Withdrawal Requests</h1>
        <div className="flex gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search requests..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <div className="w-6 h-6 text-blue-600 flex items-center justify-center text-lg font-bold">Σ</div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Requests</p>
              <p className="text-xl font-semibold">23</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
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

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-gray-50">
                <th className="px-6 py-3 text-gray-500 font-medium">Request ID</th>
                <th className="px-6 py-3 text-gray-500 font-medium">User</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Amount</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Fiat Value</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Priority</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Status</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Timestamp</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm">{request.id}</td>
                    <td className="px-6 py-4">{request.user}</td>
                    <td className="px-6 py-4 font-medium">{request.amount}</td>
                    <td className="px-6 py-4 text-gray-600">{request.fiatValue}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          request.priority === 'high'
                            ? 'bg-red-100 text-red-700'
                            : request.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {request.priority}
                      </span>
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
                    <td className="px-6 py-4 text-gray-500">{request.timestamp}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewRequest(request)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded"
                          disabled={request.status !== 'pending'}
                          onClick={() => request.status === 'pending' && setConfirmDialog({ 
                            isOpen: true, 
                            type: 'approve', 
                            request 
                          })}
                        >
                          Approve
                        </button>
                        <button
                          className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                          disabled={request.status !== 'pending'}
                          onClick={() => request.status === 'pending' && setConfirmDialog({ 
                            isOpen: true, 
                            type: 'reject', 
                            request 
                          })}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    No withdrawal requests match your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredRequests.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {filteredRequests.length} of {withdrawalRequests.length} requests
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-200 rounded text-sm disabled:opacity-50">
                Previous
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm disabled:opacity-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filter Dialog Component */}
      <FilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={setActiveFilters}
        currentFilters={activeFilters}
        fields={filterFields}
      />

      {/* Confirmation Dialog for Approve/Reject */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
            <div className="mb-4 flex items-center">
              {confirmDialog.type === 'approve' ? (
                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
              )}
              <h3 className="text-lg font-medium">
                {confirmDialog.type === 'approve' ? 'Approve Withdrawal' : 'Reject Withdrawal'}
              </h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                {confirmDialog.type === 'approve'
                  ? 'Are you sure you want to approve this withdrawal request? This action cannot be undone.'
                  : 'Are you sure you want to reject this withdrawal request? This action cannot be undone.'}
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Request ID:</span>
                  <span className="font-mono font-medium">{confirmDialog.request?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">User:</span>
                  <span>{confirmDialog.request?.user}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount:</span>
                  <span className="font-medium">{confirmDialog.request?.amount} ({confirmDialog.request?.fiatValue})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Wallet:</span>
                  <span className="font-mono text-xs truncate max-w-xs">{confirmDialog.request?.wallet}</span>
                </div>
              </div>
              
              {confirmDialog.type === 'reject' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rejection Reason
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="">Select a reason...</option>
                    <option value="suspicious">Suspicious activity</option>
                    <option value="limits">Exceeds withdrawal limits</option>
                    <option value="verification">Verification required</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDialog({ isOpen: false, type: null, request: null })}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => processRequest(confirmDialog.request, confirmDialog.type)}
                className={`px-4 py-2 rounded-lg text-white ${
                  confirmDialog.type === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {confirmDialog.type === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Request Details Dialog */}
      {viewRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Withdrawal Request Details</h3>
              <button 
                onClick={() => setViewRequest(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Request ID</p>
                  <p className="font-mono font-medium">{viewRequest.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">User</p>
                  <p>{viewRequest.user}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium">{viewRequest.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fiat Value</p>
                  <p>{viewRequest.fiatValue}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        viewRequest.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : viewRequest.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {viewRequest.status}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Priority</p>
                  <p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        viewRequest.priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : viewRequest.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {viewRequest.priority}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Timestamp</p>
                  <p>{viewRequest.timestamp}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Wallet Address</p>
                  <p className="font-mono text-sm break-all">{viewRequest.wallet}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium mb-2">Transaction History</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center mt-0.5 mr-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  </div>
                  <div>
                    <p className="text-sm">Withdrawal request submitted</p>
                    <p className="text-xs text-gray-500">{viewRequest.timestamp}</p>
                  </div>
                </div>
                {viewRequest.status === 'pending' && (
                  <div className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5 mr-3">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    </div>
                    <div>
                      <p className="text-sm">Awaiting review</p>
                      <p className="text-xs text-gray-500">Current status</p>
                    </div>
                  </div>
                )}
                {viewRequest.status === 'approved' && (
                  <div className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-3">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <div>
                      <p className="text-sm">Withdrawal approved</p>
                      <p className="text-xs text-gray-500">2024-03-14 10:15</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {viewRequest.status === 'pending' && (
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setViewRequest(null);
                    setConfirmDialog({ isOpen: true, type: 'reject', request: viewRequest });
                  }}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
                >
                  Reject
                </button>
                <button
                  onClick={() => {
                    setViewRequest(null);
                    setConfirmDialog({ isOpen: true, type: 'approve', request: viewRequest });
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}