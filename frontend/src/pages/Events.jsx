import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AuthReminder from '../components/AuthReminder';
import { X, Plus, Edit, Type, Calendar, Clock, MapPin, FileText, Tag, Globe, Star, Save, Users, ArrowRight, Filter } from 'lucide-react';
import * as eventService from '../services/eventService';

const Events = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const { user, token } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // admin modal state
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({ title: '', eventDate: '', time: '', location: '', description: '', category: 'General', featured: false, type: 'In-Person' });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await eventService.listEvents();
      const list = (res.events || []).map(e => ({
        id: e._id,
        title: e.title,
        date: e.dateText || (e.eventDate ? new Date(e.eventDate).toLocaleDateString() : ''),
        dateText: e.dateText || (e.eventDate ? new Date(e.eventDate).toLocaleDateString() : ''),
        eventDate: e.eventDate ? new Date(e.eventDate) : null,
        time: e.time,
        location: e.location,
        attendees: e.attendeesCount || (e.attendees || []).length,
        description: e.description,
        category: e.category,
        featured: e.featured,
        type: e.type,
        raw: e,
      }));
      setEvents(list);
    } catch (err) {
      console.error('Failed to load events', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const upcomingEvents = events.filter(ev => !ev.eventDate || new Date(ev.eventDate) >= new Date());
  const pastEvents = events.filter(ev => ev.eventDate && new Date(ev.eventDate) < new Date());
  const displayEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-[#02c39a] to-[#016b52] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Events & Workshops</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join our community events, workshops, and summits to connect, learn, and take action together.
            </p>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="flex bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${activeTab === 'upcoming'
                    ? 'bg-[#02c39a] text-white'
                    : 'text-gray-700 hover:text-[#02c39a]'
                  }`}
              >
                Upcoming Events
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${activeTab === 'past'
                    ? 'bg-[#02c39a] text-white'
                    : 'text-gray-700 hover:text-[#02c39a]'
                  }`}
              >
                Past Events
              </button>
            </div>
            {/** Admin create button */}
            <div className="ml-4">
              {/** show only to admin */}
              {/* admin UI controlled below */}
            </div>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {user && user.role === 'admin' && (
            <div className="flex justify-end mb-6">
              <button onClick={() => {
                setEditingEvent(null);
                setEventForm({ title: '', eventDate: '', time: '', location: '', description: '', category: 'General', featured: false, type: 'In-Person' });
                setEventModalOpen(true);
              }} className="bg-white border px-4 py-2 rounded-full text-[#016b52]">Create Event</button>
            </div>
          )}
          <div className="space-y-8">
            {displayEvents.map(event => (
              <div
                key={event.id}
                className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${event.featured ? 'ring-2 ring-[#02c39a] ring-opacity-50' : ''
                  }`}
              >
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        {event.featured && (
                          <span className="bg-[#02c39a] text-white text-xs font-bold px-3 py-1 rounded-full">
                            FEATURED
                          </span>
                        )}
                        <span className="bg-[#f0f3bd] text-[#016b52] text-xs font-semibold px-3 py-1 rounded-full">
                          {event.category}
                        </span>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${event.type === 'Virtual'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                          }`}>
                          {event.type}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">{event.description}</p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-[#02c39a]" />
                          {event.date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-[#02c39a]" />
                          {event.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-[#02c39a]" />
                          {event.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-[#02c39a]" />
                          {event.attendees} {activeTab === 'upcoming' ? 'registered' : 'attended'}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 lg:mt-0 lg:ml-8">
                      <EventActionButton event={event} activeTab={activeTab} onRegistered={() => fetchEvents()} />
                      {user && user.role === 'admin' && (
                        <div className="mt-3 flex gap-2">
                          <button onClick={() => {
                            setEditingEvent(event);
                            setEventForm({ title: event.title, eventDate: event.eventDate ? new Date(event.eventDate).toISOString().slice(0, 10) : '', time: event.time, location: event.location, description: event.description, category: event.category, featured: !!event.featured, type: event.type });
                            setEventModalOpen(true);
                          }} className="px-3 py-1 bg-yellow-50 text-yellow-800 rounded">Edit</button>
                          <button onClick={async () => {
                            if (!confirm('Delete this event?')) return;
                            try {
                              await eventService.deleteEvent(event.id, token);
                              fetchEvents();
                            } catch (err) {
                              console.error('Delete failed', err);
                            }
                          }} className="px-3 py-1 bg-red-50 text-red-800 rounded">Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Event Modal */}
      {eventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setEventModalOpen(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#02c39a]/5 to-[#028a7a]/5 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#02c39a] to-[#028a7a] rounded-full flex items-center justify-center">
                    {editingEvent ? (
                      <Edit className="h-5 w-5 text-white" />
                    ) : (
                      <Plus className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {editingEvent ? 'Edit Event' : 'Create Event'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {editingEvent ? 'Update event details' : 'Add a new event to the calendar'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEventModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
                >
                  <X className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                </button>
              </div>
            </div>

            {/* Form Container */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    if (!user || user.role !== 'admin') throw new Error('Not authorized');
                    if (editingEvent) {
                      await eventService.updateEvent(editingEvent.id, eventForm, token);
                    } else {
                      await eventService.createEvent(eventForm, token);
                    }
                    setEventModalOpen(false);
                    fetchEvents();
                  } catch (err) {
                    console.error('Event admin action failed', err);
                  }
                }}
                className="p-6 space-y-6"
              >
                {/* Title Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Type className="h-4 w-4 text-[#02c39a]" />
                    Event Title
                  </label>
                  <input
                    name="title"
                    value={eventForm.title}
                    onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter event title"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02c39a] focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400"
                    required
                  />
                </div>

                {/* Date and Time Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Calendar className="h-4 w-4 text-[#02c39a]" />
                      Date
                    </label>
                    <input
                      type="date"
                      name="eventDate"
                      value={eventForm.eventDate}
                      onChange={(e) => setEventForm(prev => ({ ...prev, eventDate: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02c39a] focus:border-transparent outline-none transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Clock className="h-4 w-4 text-[#02c39a]" />
                      Time
                    </label>
                    <input
                      name="time"
                      value={eventForm.time}
                      onChange={(e) => setEventForm(prev => ({ ...prev, time: e.target.value }))}
                      placeholder="e.g., 2:00 PM - 4:00 PM"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02c39a] focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                {/* Location Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <MapPin className="h-4 w-4 text-[#02c39a]" />
                    Location
                  </label>
                  <input
                    name="location"
                    value={eventForm.location}
                    onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter venue or address"
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
                    value={eventForm.description}
                    onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the event, activities, and any important details..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02c39a] focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 resize-none"
                  />
                </div>

                {/* Category and Type Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Tag className="h-4 w-4 text-[#02c39a]" />
                      Category
                    </label>
                    <input
                      name="category"
                      value={eventForm.category}
                      onChange={(e) => setEventForm(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g., Workshop, Meeting, Social"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02c39a] focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Globe className="h-4 w-4 text-[#02c39a]" />
                      Event Type
                    </label>
                    <select
                      name="type"
                      value={eventForm.type}
                      onChange={(e) => setEventForm(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02c39a] focus:border-transparent outline-none transition-all duration-200 bg-white"
                    >
                      <option value="In-Person">In-Person</option>
                      <option value="Virtual">Virtual</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>

                {/* Featured Checkbox */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <input
                      id="featured"
                      name="featured"
                      type="checkbox"
                      checked={!!eventForm.featured}
                      onChange={(e) => setEventForm(prev => ({ ...prev, featured: e.target.checked }))}
                      className="w-5 h-5 text-[#02c39a] bg-gray-100 border-gray-300 rounded focus:ring-[#02c39a] focus:ring-2"
                    />
                    <label htmlFor="featured" className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Mark as Featured Event
                      <span className="text-gray-500 text-xs">(Will appear prominently on the homepage)</span>
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setEventModalOpen(false)}
                    className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-[#02c39a] to-[#028a7a] text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#02c39a] focus:ring-offset-2 transition-all duration-200 flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Signup */}
      <section className="py-16 bg-[#f0f3bd]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated on Events</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive notifications about upcoming events, workshops, and community gatherings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#02c39a] focus:border-transparent"
            />
            <button className="bg-[#02c39a] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#016b52] transition-colors duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Host Event CTA */}
      <section className="py-16 bg-[#02c39a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Want to Host an Event?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            We're always looking for community partners to host events. Whether it's a workshop, seminar, or awareness campaign, we'll help you make it happen.
          </p>
          <button className="bg-[#f0f3bd] text-[#016b52] px-8 py-3 rounded-full font-semibold hover:bg-white transition-colors duration-300 inline-flex items-center">
            Propose an Event
            <Calendar className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Events;

const EventActionButton = ({ event, activeTab, onRegistered }) => {
  const { token, openAuthModal, user } = useAuth();
  const navigate = useNavigate();
  const [showReminder, setShowReminder] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleClick = async () => {
    if (activeTab === 'upcoming') {
      if (!token) {
        setShowReminder(true);
        return;
      }

      // If user already registered (check by raw.attendees), unregister; else register
      const already = event.raw && event.raw.attendees && event.raw.attendees.some(a => a._id === user?.id || a === user?.id);
      try {
        setLoading(true);
        if (already) {
          await eventService.unregisterEvent(event.id, token);
        } else {
          await eventService.registerEvent(event.id, token);
        }
        if (typeof onRegistered === 'function') onRegistered();
      } catch (err) {
        console.error('Event register/unregister failed', err);
      } finally {
        setLoading(false);
      }
    } else {
      navigate(`/events#${event.id}`);
    }
  };

  const handleSignIn = () => {
    openAuthModal('register', `/events#${event.id}`);
    setShowReminder(false);
  };

  return (
    <>
      <button onClick={handleClick} disabled={loading} className={`px-6 py-3 rounded-full font-semibold transition-colors duration-200 inline-flex items-center ${activeTab === 'upcoming'
          ? 'bg-[#02c39a] text-white hover:bg-[#016b52]'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}>
        {activeTab === 'upcoming' ? (loading ? 'Processing...' : 'Register/Toggle') : 'View Summary'}
        <ArrowRight className="ml-2 h-5 w-5" />
      </button>
      <AuthReminder open={showReminder} onClose={() => setShowReminder(false)} onSignIn={handleSignIn} message="Please sign in to join this event." />
    </>
  );
};