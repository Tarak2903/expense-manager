import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setexpense, addToSyncQueue, clearSyncQueue } from './app/slicer.js';
import { v4 as uuidv4 } from 'uuid';

const Dashboard = () => {
  const expiredsession = useNavigate();
  const { user } = useParams();
  const navigate = useNavigate();
  const expense = useSelector((state) => state.counter.value);
  const syncQueue = useSelector((state) => state.counter.syncQueue || []);
  const dispatch = useDispatch();

  const [amount, setamount] = useState('');
  const [title, settitle] = useState('');
  const [Category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [fromdate, setfromdate] = useState('');
  const [todate, settodate] = useState('');
  const [filterflag, setfilterflag] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState('Online');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      expiredsession('/');
      alert("10 minutes up redirecting to Home");
    }, 600000);
    return () => clearTimeout(timer);
  }, [expiredsession]);

  useEffect(() => {
    const storedExpenses = JSON.parse(localStorage.getItem(`${user}expense`)) || [];
    dispatch(setexpense(storedExpenses));
  }, [dispatch, user]);

  const toggleOnlineStatus = () => {
    if (!isOnline) {
      setIsSyncing(true);
      setSyncStatus('Syncing...');
      
      setTimeout(() => {
        syncQueue.forEach(action => {
          if (action.type === 'ADD') {
            const updatedExpenses = [...expense, action.data];
            dispatch(setexpense(updatedExpenses));
            localStorage.setItem(`${user}expense`, JSON.stringify(updatedExpenses));
          } else if (action.type === 'UPDATE') {
            const updatedExpenses = [...expense.filter(e => e.id !== action.data.id), action.data];
            dispatch(setexpense(updatedExpenses));
            localStorage.setItem(`${user}expense`, JSON.stringify(updatedExpenses));
          } else if (action.type === 'DELETE') {
            const updatedExpenses = expense.filter(item => item.id !== action.data.id);
            dispatch(setexpense(updatedExpenses));
            localStorage.setItem(`${user}expense`, JSON.stringify(updatedExpenses));
          }
        });
        
        dispatch(clearSyncQueue());
        setIsSyncing(false);
        setSyncStatus('All changes synced');
        
        setTimeout(() => {
          setSyncStatus('Online');
        }, 2000);
      }, 1500);
    } else {
      setSyncStatus('Offline');
    }
    setIsOnline(!isOnline);
  };

  const handleclick = () => {
    const newExpense = {
      id: editingId || uuidv4(),
      title,
      amount,
      category: Category,
      date
    };

    if (isOnline) {
      const updatedExpenses = [...expense.filter(e => e.id !== editingId), newExpense];
      dispatch(setexpense(updatedExpenses));
      localStorage.setItem(`${user}expense`, JSON.stringify(updatedExpenses));
    } else {
      const actionType = editingId ? 'UPDATE' : 'ADD';
      dispatch(addToSyncQueue({
        type: actionType,
        data: newExpense
      }));
      
      const updatedExpenses = [...expense.filter(e => e.id !== editingId), newExpense];
      dispatch(setexpense(updatedExpenses));
    }
    
    setEditingId(null);
    settitle('');
    setamount('');
    setCategory('');
    setDate('');
  };

  const handleDelete = (id) => {
    if (isOnline) {
      const updatedExpenses = expense.filter(item => item.id !== id);
      dispatch(setexpense(updatedExpenses));
      localStorage.setItem(`${user}expense`, JSON.stringify(updatedExpenses));
    } else {
      dispatch(addToSyncQueue({
        type: 'DELETE',
        data: { id }
      }));
      
      const updatedExpenses = expense.filter(item => item.id !== id);
      dispatch(setexpense(updatedExpenses));
    }
  };

  const handleEdit = (item) => {
    const filtered = expense.filter(exp => exp.id !== item.id);
    dispatch(setexpense(filtered));

    settitle(item.title);
    setamount(item.amount);
    setCategory(item.category);
    setDate(item.date);
    setEditingId(item.id);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handlefilter = () => {
    setfilterflag(true);
  };

  const handlefilterrecord = () => {
    const arr = expense.filter(item => {
      return item.date >= fromdate && item.date <= todate;
    });
    setFilteredData(arr);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 text-white p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Expense Manager</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              syncStatus === 'Online' ? 'bg-green-500' : 
              syncStatus === 'Offline' ? 'bg-red-500' : 
              'bg-yellow-500'
            }`}></div>
            <span className="mr-2">{syncStatus}</span>
            {isSyncing && (
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent mr-2"></div>
            )}
            <button
              onClick={toggleOnlineStatus}
              className={`px-3 py-1 rounded text-white ${
                isOnline ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isOnline ? 'Go Offline' : 'Go Online'}
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {!isOnline && syncQueue.length > 0 && (
        <div className="mb-4 p-2 bg-yellow-800 text-yellow-100 rounded flex items-center justify-between">
          <div>
            <span className="font-medium">{syncQueue.length} pending changes</span> - will sync when online
          </div>
        </div>
      )}

      {filterflag && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl space-y-4 w-full max-w-sm">
            <div>
              <label className="block mb-1">From</label>
              <input
                type="date"
                value={fromdate}
                onChange={(e) => setfromdate(e.target.value)}
                className="w-full border border-gray-600 bg-gray-900 text-white rounded p-2"
              />
            </div>
            <div>
              <label className="block mb-1">To</label>
              <input
                type="date"
                value={todate}
                onChange={(e) => settodate(e.target.value)}
                className="w-full border border-gray-600 bg-gray-900 text-white rounded p-2"
              />
            </div>
            <div className="flex justify-between gap-2">
              <button
                onClick={handlefilterrecord}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded w-full"
              >
                Search
              </button>
              <button
                onClick={() => setfilterflag(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded w-full"
              >
                Close
              </button>
            </div>

            {filteredData.length > 0 && (
              <div className="space-y-3 mt-4">
                <h3 className="text-lg font-semibold">Filtered Results</h3>
                {filteredData.map(item => (
                  <div key={item.id} className="bg-gray-700 p-3 rounded shadow">
                    <div className="font-medium">{item.title} - ₹ {item.amount}</div>
                    <div className="text-sm text-gray-300">{item.category} | {item.date}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto bg-gray-900 rounded-xl shadow-md p-6 space-y-4 border border-gray-700">
        <input
          type="text"
          value={title}
          onChange={(e) => settitle(e.target.value)}
          placeholder="Title"
          className="w-full border border-gray-600 bg-gray-800 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-gray-600 bg-gray-800 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          value={Category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="w-full border border-gray-600 bg-gray-800 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setamount(e.target.value)}
          placeholder="Amount"
          className="w-full border border-gray-600 bg-gray-800 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleclick}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
        >
          {editingId ? 'Update' : 'Submit'}
        </button>
      </div>

      <div className="mt-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center">All Expenses</h2>
        <button
        onClick={handlefilter}
        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded mb-4"
      >
        Filter
      </button>
        <div className="space-y-6">
          {expense.map(item => (
            <div key={item.id} className="bg-gray-800 rounded-xl p-4 shadow-md border border-gray-700">
              <table className="w-full text-left text-sm text-gray-300 mb-2">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-600">
                    <th className="py-1 w-1/4">Title</th>
                    <th className="py-1 w-1/4">Category</th>
                    <th className="py-1 w-1/4">Date</th>
                    <th className="py-1 w-1/4">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="font-medium">
                    <td className="py-1 w-1/4 break-words whitespace-pre-wrap">{item.title}</td>
                    <td className="py-1 w-1/4 break-words whitespace-pre-wrap">{item.category}</td>
                    <td className="py-1 w-1/4">{item.date}</td>
                    <td className="py-1 w-1/4 text-green-400 font-semibold">₹ {item.amount}</td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;