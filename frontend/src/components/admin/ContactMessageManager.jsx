import React, { useState, useEffect } from 'react';
import { contactMessageAPI } from '../../services/api';
import { 
  Mail, 
  Eye, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  User,
  MessageSquare,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

const ContactMessageManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const { data } = await contactMessageAPI.getMessages();
      setMessages(data);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const { data } = await contactMessageAPI.updateMessageStatus(id, { status });
      setMessages(messages.map(msg => msg._id === id ? data.data : msg));
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      await contactMessageAPI.deleteMessage(id);
      setMessages(messages.filter(msg => msg._id !== id));
      if (selectedMessage?._id === id) setSelectedMessage(null);
      toast.success('Message deleted successfully');
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      unread: <span className="inline-flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>Unread</span>,
      read: <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>Read</span>,
      replied: <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>Replied</span>,
    };
    return badges[status] || badges.unread;
  };

  const filteredMessages = filter === 'all' 
    ? messages 
    : messages.filter(msg => msg.status === filter);

  const unreadCount = messages.filter(msg => msg.status === 'unread').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-army">Contact Messages</h2>
          <p className="text-sm text-gray-500 mt-1">Manage messages from your website visitors</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-red-50 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-red-600">{unreadCount} Unread</span>
          </div>
          <button
            onClick={loadMessages}
            className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all' ? 'bg-gold text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All ({messages.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'unread' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Unread ({messages.filter(m => m.status === 'unread').length})
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'read' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Read ({messages.filter(m => m.status === 'read').length})
        </button>
        <button
          onClick={() => setFilter('replied')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'replied' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Replied ({messages.filter(m => m.status === 'replied').length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No messages found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {filteredMessages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      msg.status === 'unread' ? 'bg-amber-50/50' : ''
                    } ${selectedMessage?._id === msg._id ? 'bg-gold/5 border-l-4 border-gold' : ''}`}
                    onClick={() => setSelectedMessage(msg)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-army truncate">{msg.name}</h4>
                          {getStatusBadge(msg.status)}
                        </div>
                        <p className="text-sm text-gray-500 truncate">{msg.email}</p>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{msg.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(msg.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMessage(msg._id);
                          }}
                          className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sticky top-20">
            {selectedMessage ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-army">Message Details</h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => updateStatus(selectedMessage._id, 'read')}
                      className={`p-1.5 rounded transition-colors ${
                        selectedMessage.status === 'read' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                      }`}
                      title="Mark as Read"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => updateStatus(selectedMessage._id, 'replied')}
                      className={`p-1.5 rounded transition-colors ${
                        selectedMessage.status === 'replied' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100'
                      }`}
                      title="Mark as Replied"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteMessage(selectedMessage._id)}
                      className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-gold" />
                    <span className="font-medium">{selectedMessage.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gold" />
                    <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">
                      {selectedMessage.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gold" />
                    <span className="text-gray-600">
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gold" />
                    <span className="text-gray-600">
                      Status: <span className="font-medium">{selectedMessage.status}</span>
                    </span>
                  </div>
                  {selectedMessage.ip && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400 text-xs">IP: {selectedMessage.ip}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 mt-3">
                    <h4 className="text-sm font-medium text-army mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-gold" />
                      Message
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg">
                      {selectedMessage.message}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.name}`}
                      className="flex-1 bg-gold text-white text-center py-2 rounded-lg hover:bg-gold-dark transition-colors text-sm"
                    >
                      Reply via Email
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Select a message to view</p>
                <p className="text-xs text-gray-400 mt-1">Click on any message from the list</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactMessageManager;