import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Users, Target, Heart, Award, Calendar, Megaphone, Globe, Lightbulb, Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Format numbers into shorthand (50K, 1M, etc.)
const formatNumber = (num) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toString();
};

const StatItem = ({ value, suffix, label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          let startTime = null;
          const duration = 3000; // 2s animation

          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);

            const newCount = Math.floor(easeOut * value);
            setCount(newCount);

            if (progress < 1) {
              requestAnimationFrame(step);
            }
          };

          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [value]);

  return (
    <div className="space-y-2 text-center" ref={ref}>
      <div className="text-4xl font-bold text-[#02c39a]">
        {formatNumber(count)}
        {suffix}
      </div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
};


const Landing = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    contactReason: 'general'
  });

  const [visibleTimelineItems, setVisibleTimelineItems] = useState([]);
  const timelineRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleTimelineItems(prev => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.3 }
    );

    timelineRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      contactReason: 'general'
    });
  };

  const contactReasons = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'volunteer', label: 'Volunteer Opportunities' },
    { value: 'partnership', label: 'Partnership Proposal' },
    { value: 'campaign', label: 'Start a Campaign' },
    { value: 'media', label: 'Media & Press' },
    { value: 'support', label: 'Technical Support' }
  ];

  const [cursor, setCursor] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCursor({ x, y });
  };

  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description: "We lead with empathy and understanding, putting human dignity at the center of everything we do."
    },
    {
      icon: Target,
      title: "Impact",
      description: "We focus on measurable outcomes and sustainable solutions that create lasting positive change."
    },
    {
      icon: Users,
      title: "Community",
      description: "We believe in the power of collective action and the strength that comes from working together."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "We think globally and act locally, addressing issues that affect communities worldwide."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We embrace creative solutions and new approaches to tackle complex social challenges."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for the highest standards in our work and hold ourselves accountable for results."
    }
  ];

  const timelineEvents = [
    {
      year: "2020",
      title: "Foundation",
      description: "SocialImpact was founded with the vision of connecting changemakers worldwide."
    },
    {
      year: "2021",
      title: "First Major Campaign",
      description: "Launched our first major campaign reaching 100,000 people globally."
    },
    {
      year: "2022",
      title: "Global Expansion",
      description: "Expanded to 25 countries and partnered with 100+ local organizations."
    },
    {
      year: "2023",
      title: "Million Lives Milestone",
      description: "Reached 1 million people impacted and launched our digital platform."
    },
    {
      year: "2024",
      title: "200+ Campaigns",
      description: "Achieved 200+ active campaigns and expanded to 75 countries worldwide."
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#02c39a] to-[#016b52] text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Create Positive
              <span className="block text-[#f0f3bd]">Change Together</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Join our global community of changemakers working to address social issues and build a better tomorrow for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/campaigns"
                className="bg-[#f0f3bd] text-[#016b52] px-8 py-4 rounded-full font-semibold text-lg hover:bg-white transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
              >
                Explore Campaigns
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/events"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-[#016b52] transition-all duration-300 transform hover:scale-105"
              >
                Upcoming Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#f0f3bd]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem value={50000} suffix="+" label="Active Members" />
            <StatItem value={200} suffix="+" label="Campaigns" />
            <StatItem value={1000000} suffix="+" label="Lives Impacted" />
            <StatItem value={75} suffix="+" label="Countries" />
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How We Make Impact</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Through collective action, awareness, and community engagement, we're building a movement for positive change.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-[#02c39a]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#02c39a] transition-colors duration-300">
                  <Megaphone className="h-8 w-8 text-[#02c39a] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Raise Awareness</h3>
                <p className="text-gray-600 leading-relaxed">
                  Educate communities about critical social issues through compelling campaigns and evidence-based information.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-[#02c39a]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#02c39a] transition-colors duration-300">
                  <Users className="h-8 w-8 text-[#02c39a] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Mobilize Communities</h3>
                <p className="text-gray-600 leading-relaxed">
                  Connect like-minded individuals and organizations to create powerful networks for social change.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-[#02c39a]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#02c39a] transition-colors duration-300">
                  <Target className="h-8 w-8 text-[#02c39a] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Drive Action</h3>
                <p className="text-gray-600 leading-relaxed">
                  Transform awareness into concrete action through organized events, volunteer opportunities, and advocacy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Mission & Vision */}
      <section className="py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">About Raisora</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're a global community of changemakers, advocates, and organizations working together to create positive social impact through awareness, action, and collective effort.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            <div className="bg-gray-100 rounded-2xl p-6">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                To empower communities worldwide by raising awareness about social issues, mobilizing action, and providing platforms for a change. We believe that when people come together with a shared purpose, they can solve the world's pressing challenges.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Through campaigns, educational resources, and community events, we bridge the gap between awareness and action, transforming passion into measurable impact.
              </p>
            </div>
            <div>
              {/* Our Vision Section */}
              <div
                onMouseMove={handleMouseMove}
                className="relative rounded-2xl p-8 bg-[#f0f3bd]/30 overflow-hidden"
              >
                {/* Cursor gradient border */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    padding: "5px",
                    background: `radial-gradient(circle at ${cursor.x}% ${cursor.y}%, #02c39a, #016b52 70%)`,
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                ></div>

                {/* Content */}
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  A world where every individual has the power to create positive
                  change, where social issues are addressed through collaborative
                  effort, and where communities are empowered to build sustainable
                  solutions.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We envision a future where social awareness leads to tangible
                  action, creating a ripple effect of positive change that spans
                  across borders, cultures, and generations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape our approach to creating positive social change.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-[#02c39a]/10 rounded-full flex items-center justify-center mb-6">
                  <value.icon className="h-8 w-8 text-[#02c39a]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From a simple idea to a global movement, here's how we've grown over the years.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-[#02c39a]/30"></div>

            <div className="space-y-12">
              {timelineEvents.map((event, index) => (
                <div
                  key={index}
                  ref={(el) => (timelineRefs.current[index] = el)}
                  data-index={index}
                  className={`flex items-center transition-all duration-700 ${visibleTimelineItems.includes(index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                    }`}
                >
                  {index % 2 === 0 ? (
                    <>
                      <div className="flex-1 text-right pr-8">
                        <div className={`bg-white p-6 rounded-xl shadow-lg transition-all duration-500 delay-200 ${visibleTimelineItems.includes(index)
                          ? 'transform translate-x-0'
                          : 'transform translate-x-8'
                          }`}>
                          <h3 className="text-2xl font-bold text-[#02c39a] mb-2">{event.year}</h3>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h4>
                          <p className="text-gray-600">{event.description}</p>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-4 border-white shadow-lg z-10 transition-all duration-500 delay-300 ${visibleTimelineItems.includes(index)
                        ? 'bg-[#02c39a] scale-100'
                        : 'bg-gray-300 scale-75'
                        }`}></div>
                      <div className="flex-1 pl-8"></div>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 pr-8"></div>
                      <div className={`w-6 h-6 rounded-full border-4 border-white shadow-lg z-10 transition-all duration-500 delay-300 ${visibleTimelineItems.includes(index)
                        ? 'bg-[#02c39a] scale-100'
                        : 'bg-gray-300 scale-75'
                        }`}></div>
                      <div className="flex-1 text-left pl-8">
                        <div className={`bg-white p-6 rounded-xl shadow-lg transition-all duration-500 delay-200 ${visibleTimelineItems.includes(index)
                          ? 'transform translate-x-0'
                          : 'transform -translate-x-8'
                          }`}>
                          <h3 className="text-2xl font-bold text-[#02c39a] mb-2">{event.year}</h3>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h4>
                          <p className="text-gray-600">{event.description}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ready to make a difference? We'd love to hear from you. Let's work together to create positive change.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div
              onMouseMove={handleMouseMove}
              className="relative rounded-2xl p-8 overflow-hidden"
            >
              {/* Cursor gradient border */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  padding: "5px",
                  background: `radial-gradient(circle at ${cursor.x}% ${cursor.y}%, #02c39a, #016b52 70%)`,
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              ></div>
              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02c39a] focus:border-transparent transition-colors duration-200"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02c39a] focus:border-transparent transition-colors duration-200"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contactReason" className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Contact
                    </label>
                    <select
                      id="contactReason"
                      name="contactReason"
                      value={formData.contactReason}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02c39a] focus:border-transparent transition-colors duration-200"
                    >
                      {contactReasons.map(reason => (
                        <option key={reason.value} value={reason.value}>
                          {reason.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02c39a] focus:border-transparent transition-colors duration-200"
                      placeholder="Brief description of your inquiry"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02c39a] focus:border-transparent transition-colors duration-200 resize-vertical"
                      placeholder="Tell us more about your inquiry or how you'd like to get involved..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#02c39a] text-white px-6 py-4 rounded-lg font-semibold hover:bg-[#016b52] transition-colors duration-200 inline-flex items-center justify-center"
                  >
                    Send Message
                    <Send className="ml-2 h-5 w-5" />
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                <p className="text-lg text-gray-600 mb-8">
                  We're here to help and would love to hear from you. Reach out to us through any of the following channels.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#02c39a]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-[#02c39a]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Email Us</h4>
                    <p className="text-gray-600">info@socialimpact.org</p>
                    <p className="text-gray-600">partnerships@socialimpact.org</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#02c39a]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-[#02c39a]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Call Us</h4>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-gray-600">Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#02c39a]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-[#02c39a]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Visit Us</h4>
                    <p className="text-gray-600">123 Hope Street</p>
                    <p className="text-gray-600">New York, NY 10001</p>
                  </div>
                </div>
              </div>

              {/* Get Involved Cards */}
              <div className="mt-12 space-y-4">
                <h4 className="text-xl font-bold text-gray-900 mb-6">Ways to Get Involved</h4>

                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#f0f3bd] rounded-lg flex items-center justify-center group-hover:bg-[#02c39a] transition-colors duration-300">
                      <Heart className="h-6 w-6 text-[#016b52] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <h5 className="text-lg font-semibold text-gray-900">Volunteer</h5>
                      <p className="text-gray-600">Join our community of volunteers making a difference</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#f0f3bd] rounded-lg flex items-center justify-center group-hover:bg-[#02c39a] transition-colors duration-300">
                      <Users className="h-6 w-6 text-[#016b52] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <h5 className="text-lg font-semibold text-gray-900">Partner</h5>
                      <p className="text-gray-600">Collaborate with us on impactful initiatives</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#f0f3bd] rounded-lg flex items-center justify-center group-hover:bg-[#02c39a] transition-colors duration-300">
                      <Globe className="h-6 w-6 text-[#016b52] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <h5 className="text-lg font-semibold text-gray-900">Start a Campaign</h5>
                      <p className="text-gray-600">Launch your own social awareness campaign</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-[#02c39a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of changemakers who are already creating positive impact in their communities and beyond.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/campaigns"
              className="bg-[#f0f3bd] text-[#016b52] px-8 py-4 rounded-full font-semibold text-lg hover:bg-white transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
            >
              Explore Campaigns
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a
              href="#contact"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-[#016b52] transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
            >
              Get In Touch
              <Heart className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;