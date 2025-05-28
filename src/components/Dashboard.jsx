import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const Dashboard = () => {
  const expiredsession = useNavigate();
  const { user } = useParams();
  const navigate = useNavigate();

  const [expense, setExpense] = useState([]);
  const [amount, setamount] = useState('');
  const [title, settitle] = useState('');
  const [Category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [fromdate, setfromdate] = useState('');
  const [todate, settodate] = useState('');
  const [filterflag, setfilterflag] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      expiredsession('/');
      alert("10 minutes up redirecting to Home");
    }, 600000); // 10 minutes
    return () => clearTimeout(timer);
  }, [expiredsession]);
  const fetchExpenses = async () => {
    try {
      const response = await fetch(`http://localhost:3000/dashboard/${user}`);
      const data = await response.json();
      if (data.success) {
        setExpense(data.result);
      } else {
        console.error("Failed to fetch expenses");
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };
 useEffect(() => {
  fetchExpenses();
}, [user]);


 
  const hit=async(newExpense)=>{
    let req= await fetch(`http://localhost:3000/dashboard/${user}`,
      {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExpense),
      }
    )
  }
  const handleclick = async () => {
    const newExpense = {
      id: editingId || uuidv4(),
      title,
      amount,
      category: Category,
      date
    };

   await hit(newExpense);

    setEditingId(null);
    settitle('');
    setamount('');
    setCategory('');
    setDate('');
    fetchExpenses();
  };
  const hat= async (id) => {
    let req= fetch(`http://localhost:3000/dashboard/${user}`,{
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({id}),
    })
  }
  
  const handleDelete = async (id) => {
    await hat(id);
     await fetchExpenses();
  };

  const handleEdit = async (item) => {
    await hat(item.id)

    settitle(item.title);
    setamount(item.amount);
    setCategory(item.category);
    setDate(item.date);
    setEditingId(item.id);
     await fetchExpenses();
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
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

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
          className="w-full border border-gray-600 bg-gray-800 text-white rounded p-2"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-gray-600 bg-gray-800 text-white rounded p-2"
        />
        <input
          type="text"
          value={Category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="w-full border border-gray-600 bg-gray-800 text-white rounded p-2"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setamount(e.target.value)}
          placeholder="Amount"
          className="w-full border border-gray-600 bg-gray-800 text-white rounded p-2"
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
