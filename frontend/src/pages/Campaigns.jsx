import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import AuthReminder from '../components/AuthReminder';
import * as campaignService from '../services/campaignService';
import { useAuth } from '../context/AuthContext';
import {
  Users, Target, Clock, ArrowRight, Filter, Search, Star, Heart, X, Plus, Edit, Type, FileText, Tag, TrendingUp,
  Image, Info, AlertTriangle, Eye, Save
} from 'lucide-react';

const Campaigns = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = ['all', 'Environment', 'Education', 'Healthcare', 'Technology', 'Human Rights'];
  const { user, token } = useAuth();

  const normalizeCampaign = (c) => ({
    _id: c._id || c.id,
    title: c.title,
    description: c.description || '',
    organiser: (c.organiser && (c.organiser.username || c.organiser)) ? c.organiser : c.organiser || null,
    attendees: Array.isArray(c.attendees) ? c.attendees : (c.attendees ? [c.attendees] : []),
    category: c.category || 'General',
    progress: typeof c.progress === 'number' ? c.progress : Math.min(100, Math.floor(((c.attendees || []).length / (c.target || 10)) * 100)),
    supporters: (c.attendees || []).length,
    target: c.target || 10000,
    timeLeft: c.timeLeft || 'N/A',
    image: c.image || 'bg-gradient-to-br from-gray-400 to-gray-600',
    urgent: c.urgent || false,
  });

  // Replace or insert a normalized campaign into state
  const upsertCampaign = (raw) => {
    const returned = raw.campaign || raw;
    const normal = normalizeCampaign(returned);
    setCampaigns(prev => {
      const exists = prev.some(p => p._id === normal._id);
      if (exists) return prev.map(p => p._id === normal._id ? normal : p);
      return [normal, ...prev];
    });
    return normal;
  };

  // admin modal state
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [adminForm, setAdminForm] = useState({ title: '', description: '', category: 'General', progress: 0, target: 10000, timeLeft: 'N/A', image: '', urgent: false });

  const openCreateModal = () => {
    setEditingCampaign(null);
    setAdminForm({ title: '', description: '', category: 'General', progress: 0, target: 10000, timeLeft: 'N/A', image: '', urgent: false });
    setAdminModalOpen(true);
  };

  const openEditModal = (campaign) => {
    setEditingCampaign(campaign);
    setAdminForm({
      title: campaign.title || '',
      description: campaign.description || '',
      category: campaign.category || 'General',
      progress: campaign.progress || 0,
      target: campaign.target || 10000,
      timeLeft: campaign.timeLeft || 'N/A',
      image: campaign.image || '',
      urgent: !!campaign.urgent,
    });
    setAdminModalOpen(true);
  };

  const closeAdminModal = () => setAdminModalOpen(false);

  const handleAdminFormChange = (e) => setAdminForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const submitAdminForm = async (e) => {
    e.preventDefault();
    try {
      if (!user || user.role !== 'admin') throw new Error('Not authorized');
      if (editingCampaign) {
        const res = await campaignService.updateCampaign(editingCampaign._id, adminForm, token);
        upsertCampaign(res);
      } else {
        const res = await campaignService.createCampaign(adminForm, token);
        upsertCampaign(res);
      }
      closeAdminModal();
    } catch (err) {
      console.error('Admin action failed', err);
    }
  };

  const handleDelete = async (id) => {
    if (!user || user.role !== 'admin') return;
    if (!confirm('Delete this campaign?')) return;
    try {
      await campaignService.deleteCampaign(id, token);
      setCampaigns(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesCategory = activeFilter === 'all' || campaign.category === activeFilter;
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (campaign.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    campaignService.listCampaigns()
      .then(res => {
        if (!mounted) return;
        const list = (res.campaigns || []).map(normalizeCampaign);
        setCampaigns(list);
      })
      .catch(err => console.error('Failed to load campaigns', err))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-[#02c39a] to-[#016b52] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Active Campaigns</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Discover and support meaningful campaigns that are creating positive change around the world.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#02c39a] focus:border-transparent"
              />
            </div>

            {/* Category Filters */}
            <div className="flex items-center space-x-2 flex-wrap">
              <Filter className="h-5 w-5 text-gray-500" />
              {user && user.role === 'admin' && (
                <button onClick={openCreateModal} className="ml-4 bg-white text-[#016b52] px-3 py-2 rounded-full border">Create Campaign</button>
              )}
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${activeFilter === category
                      ? 'bg-[#02c39a] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-[#f0f3bd]'
                    }`}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Campaigns Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">No campaigns found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCampaigns.map(campaign => (
                <div key={campaign._id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  {campaign.urgent && (
                    <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 absolute z-10 m-4 rounded-full">
                      URGENT
                    </div>
                  )}

                  <div className={`h-48 ${campaign.image}`}></div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-[#f0f3bd] text-[#016b52] text-xs font-semibold px-2 py-1 rounded-full">
                        {campaign.category}
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        {campaign.timeLeft}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{campaign.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{campaign.description}</p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{campaign.progress}% Complete</span>
                        <span>{campaign.supporters.toLocaleString()} / {campaign.target.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#02c39a] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${campaign.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-500 text-sm">
                        <Users className="h-4 w-4 mr-1" />
                        {((campaign.supporters != null) ? campaign.supporters : (campaign.attendees || []).length).toLocaleString()} supporters
                      </div>
                      <div className="flex items-center gap-2">
                        <CampaignSupportButton campaign={campaign} onJoined={(updated) => upsertCampaign(updated)} />
                        {/* Leave button for members */}
                        {(user && (campaign.attendees || []).some(a => a === user.id || a._id === user.id)) && (
                          <button onClick={async () => {
                            try {
                              const res = await campaignService.leaveCampaign(campaign._id, token);
                              upsertCampaign(res);
                            } catch (err) {
                              console.error('Leave failed', err);
                            }
                          }} className="text-sm px-3 py-1 bg-blue-50 text-blue-800 rounded">Leave</button>
                        )}
                        {user && user.role === 'admin' && (
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEditModal(campaign)} className="text-sm px-3 py-1 bg-yellow-50 text-yellow-800 rounded">Edit</button>
                            <button onClick={() => handleDelete(campaign._id)} className="text-sm px-3 py-1 bg-red-50 text-red-800 rounded">Delete</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Success Story */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Story Spotlight</h2>
            <p className="text-lg text-gray-600">See how your support creates real change</p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 bg-gradient-to-br from-green-400 to-blue-500 p-8 text-white flex items-center">
                <div>
                  <div className="flex items-center mb-4">
                    <Star className="h-6 w-6 mr-2 text-yellow-300" />
                    <span className="font-semibold">SUCCESS STORY</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Clean Water for 1,000+ Families</h3>
                  <p className="text-lg opacity-90 mb-6">
                    Thanks to supporters like you, we successfully built 5 new wells in rural Kenya,
                    providing clean water access to over 1,000 families and reducing waterborne diseases by 85%.
                  </p>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">1,247</div>
                      <div className="text-sm opacity-80">Families Helped</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">85%</div>
                      <div className="text-sm opacity-80">Disease Reduction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">5</div>
                      <div className="text-sm opacity-80">Wells Built</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 p-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Community Impact</h4>
                      <p className="text-gray-600 text-sm">Children now spend more time in school instead of fetching water.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Heart className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Health Benefits</h4>
                      <p className="text-gray-600 text-sm">Dramatic reduction in waterborne illnesses and infections.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Target className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Long-term Sustainability</h4>
                      <p className="text-gray-600 text-sm">Local maintenance teams trained to keep wells operational.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#f0f3bd]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Have an Idea for a Campaign?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            We're always looking for passionate individuals who want to create positive change. Start your own campaign today.
          </p>
          <button className="bg-[#02c39a] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#016b52] transition-colors duration-300 inline-flex items-center">
            Start a Campaign
            <Target className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Admin modal */}
      {adminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeAdminModal}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#02c39a]/5 to-[#028a7a]/5 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#02c39a] to-[#028a7a] rounded-full flex items-center justify-center">
                    {editingCampaign ? (
                      <Edit className="h-5 w-5 text-white" />
                    ) : (
                      <Plus className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {editingCampaign ? 'Edit Campaign' : 'Create Campaign'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {editingCampaign ? 'Update campaign details' : 'Add a new supporter campaign'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeAdminModal}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
                >
                  <X className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                </button>
              </div>
            </div>

            {/* Form Container */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <form onSubmit={submitAdminForm} className="p-6 space-y-6">

                {/* Title Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Type className="h-4 w-4 text-[#02c39a]" />
                    Campaign Title
                  </label>
                  <input
                    name="title"
                    value={adminForm.title}
                    onChange={handleAdminFormChange}
                    placeholder="Enter campaign title"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02c39a] focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400"
                    required
                  />
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FileText className="h-4 w-4 text-[#02c39a]" />
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={adminForm.description}
                    onChange={handleAdminFormChange}
                    placeholder="Describe the campaign purpose and goals..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02c39a] focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 resize-none"
                  />
                </div>

                {/* Category and Time Left Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Tag className="h-4 w-4 text-[#02c39a]" />
                      Category
                    </label>
                    <input
                      name="category"
                      value={adminForm.category}
                      onChange={handleAdminFormChange}
                      placeholder="e.g., Community, Environment, Education"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02c39a] focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Clock className="h-4 w-4 text-[#02c39a]" />
                      Time Left
                    </label>
                    <input
                      name="timeLeft"
                      value={adminForm.timeLeft}
                      onChange={handleAdminFormChange}
                      placeholder="e.g., 30 days, 2 weeks"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02c39a] focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Target and Progress Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Users className="h-4 w-4 text-[#02c39a]" />
                      Supporters Target
                    </label>
                    <div className="relative">
                      <input
                        name="target"
                        type="number"
                        value={adminForm.target}
                        onChange={(e) => setAdminForm(prev => ({ ...prev, target: Number(e.target.value) }))}
                        placeholder="500"
                        min="0"
                        step="10"
                        className="w-full px-4 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02c39a] focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">supporters</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <TrendingUp className="h-4 w-4 text-[#02c39a]" />
                      Progress (%)
                    </label>
                    <div className="relative">
                      <input
                        name="progress"
                        type="number"
                        value={adminForm.progress}
                        onChange={(e) => setAdminForm(prev => ({ ...prev, progress: Number(e.target.value) }))}
                        placeholder="75"
                        min="0"
                        max="100"
                        step="1"
                        className="w-full px-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02c39a] focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                    </div>
                    {/* Progress Preview */}
                    {adminForm.progress > 0 && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-[#02c39a] to-[#028a7a] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(adminForm.progress, 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Progress preview</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Image and Urgent Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Image className="h-4 w-4 text-[#02c39a]" />
                      Campaign Image
                    </label>
                    <input
                      name="image"
                      value={adminForm.image}
                      onChange={handleAdminFormChange}
                      placeholder="Enter image URL or CSS classes"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02c39a] focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400"
                    />
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      URL (https://...) or CSS gradient classes
                    </p>
                  </div>

                  {/* Urgent Checkbox */}
                  <div className="flex items-center justify-center">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 w-full">
                      <div className="flex flex-col items-center text-center gap-2">
                        <input
                          id="urgent"
                          name="urgent"
                          type="checkbox"
                          checked={!!adminForm.urgent}
                          onChange={(e) => setAdminForm(prev => ({ ...prev, urgent: e.target.checked }))}
                          className="w-5 h-5 text-orange-500 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                        />
                        <label htmlFor="urgent" className="flex flex-col items-center gap-1 text-sm font-medium text-orange-800 cursor-pointer">
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            <span>Urgent</span>
                          </div>
                          <span className="text-orange-600 text-xs">Mark as priority</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={closeAdminModal}
                    className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-[#02c39a] to-[#028a7a] text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#02c39a] focus:ring-offset-2 transition-all duration-200 flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campaigns;

const CampaignSupportButton = ({ campaign, onJoined }) => {
  const { token, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [showReminder, setShowReminder] = React.useState(false);
  const [joining, setJoining] = React.useState(false);

  const handleSupport = () => {
    if (!token) {
      setShowReminder(true);
    } else {
      // go to campaign detail or open support flow
      navigate(`/campaigns#${campaign._id}`);
    }
  };

  const handleSignIn = () => {
    // open auth modal with redirect to this campaign
    openAuthModal('login', `/campaigns#${campaign.id}`);
    setShowReminder(false);
  };

  const handleJoin = async () => {
    if (!token) return setShowReminder(true);
    setJoining(true);
    try {
      const res = await campaignService.joinCampaign(campaign._id, token);
      // if parent provided onJoined, call it
      if (typeof onJoined === 'function') onJoined(res.campaign || res);
    } catch (err) {
      console.error('Join failed', err);
      // optionally show toast
    } finally {
      setJoining(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button onClick={handleSupport} className="bg-[#02c39a] text-white px-4 py-2 rounded-full hover:bg-[#016b52] transition-colors duration-200 font-medium text-sm inline-flex items-center">
          Support
          <ArrowRight className="ml-1 h-4 w-4" />
        </button>
        <button onClick={handleJoin} disabled={joining} className="bg-white border border-[#02c39a] text-[#02c39a] px-3 py-2 rounded-full hover:bg-[#f0fff8] transition-colors duration-200 text-sm">
          {joining ? 'Joining...' : 'Join'}
        </button>
      </div>
      <AuthReminder open={showReminder} onClose={() => setShowReminder(false)} onSignIn={handleSignIn} message="You need to sign in to support this campaign." />
    </>
  );
};