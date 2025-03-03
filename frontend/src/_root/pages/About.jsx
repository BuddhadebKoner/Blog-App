import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Users, MessageSquare, BookOpen } from 'lucide-react';
import { Helmet } from 'react-helmet';

const About = () => {
  const navigate = useNavigate();

  // Example team data
  const teamMembers = [
    {
      id: 1,
      name: "Alex Morgan",
      role: "Founder & Editor",
      bio: "Alex has over 10 years of experience in digital content creation and curation.",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256"
    },
    {
      id: 2,
      name: "Jamie Chen",
      role: "Senior Writer",
      bio: "Jamie specializes in technology trends and innovation in the digital space.",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256"
    },
    {
      id: 3,
      name: "Taylor Wilson",
      role: "Community Manager",
      bio: "Taylor builds and nurtures our growing community of readers and contributors.",
      imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256"
    }
  ];

  // Stats data
  const stats = [
    { id: 1, label: "Articles Published", value: "500+", icon: BookOpen },
    { id: 2, label: "Community Members", value: "10,000+", icon: Users },
    { id: 3, label: "Reader Comments", value: "25,000+", icon: MessageSquare }
  ];

  return (
    <>
      <Helmet>
        <title>About - Blog</title>
      </Helmet>
      <div className="w-full h-fit overflow-auto max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="w-full px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              About Our Blog
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              We're passionate about sharing knowledge, fostering meaningful discussions, and building a community of engaged readers and writers.
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="w-full px-4 py-12 bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Our Story
            </h2>
            <div className="space-y-6 text-gray-600 dark:text-gray-400">
              <p>
                Founded in 2020, our blog began as a small personal project to share insights on technology and digital culture. What started as a hobby quickly evolved into something much bigger as readers from around the world connected with our content.
              </p>
              <p>
                Today, we're proud to host a diverse range of voices and perspectives. Our platform has grown into a community where experts and enthusiasts alike can share their knowledge, experiences, and ideas.
              </p>
              <p>
                We believe in the power of well-crafted content to inform, inspire, and create meaningful connections. Every article published on our platform is carefully curated to ensure it provides value to our readers.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="w-full px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 rounded-lg border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Quality Over Quantity
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We prioritize well-researched, thoughtful content that provides genuine value to our readers rather than chasing trends or clicks.
                </p>
              </div>

              <div className="p-6 rounded-lg border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Inclusive Community
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We strive to create a welcoming space where diverse voices and perspectives are valued and respected.
                </p>
              </div>

              <div className="p-6 rounded-lg border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Continuous Learning
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We believe in the importance of lifelong learning and aim to foster curiosity and intellectual growth.
                </p>
              </div>

              <div className="p-6 rounded-lg border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Transparency & Authenticity
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We're committed to being honest and authentic in our content, building trust with our audience through transparency.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full px-4 py-16 bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)]">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
              Our Impact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.id} className="flex flex-col items-center text-center">
                    <Icon className="w-10 h-10 mb-4 text-[var(--color-button-primary-light)] dark:text-[var(--color-button-primary-dark)]" />
                    <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</p>
                    <p className="text-lg text-gray-600 dark:text-gray-400">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="w-full px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex flex-col items-center text-center p-6 rounded-lg border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                    <img
                      src="/api/placeholder/100/100"
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                  <p className="text-[var(--color-button-primary-light)] dark:text-[var(--color-button-primary-dark)] mb-3">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="w-full px-4 py-16 bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] rounded-lg mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Get in Touch
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Have questions, feedback, or just want to say hello? We'd love to hear from you!
            </p>
            <div className="flex justify-center space-x-6 mb-8">
              <a href="mailto:info@yourblog.com" className="text-[var(--color-button-primary-light)] dark:text-[var(--color-button-primary-dark)] hover:opacity-80 transition-opacity">
                <Mail className="w-6 h-6" />
              </a>
              {/* <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[var(--color-button-primary-light)] dark:text-[var(--color-button-primary-dark)] hover:opacity-80 transition-opacity">
              <Github className="w-6 h-6" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[var(--color-button-primary-light)] dark:text-[var(--color-button-primary-dark)] hover:opacity-80 transition-opacity">
              <LinkedinIcon className="w-6 h-6" />
            </a> */}
            </div>
            <button
              onClick={() => navigate('/blogs')}
              className="px-6 py-3 bg-[var(--color-button-primary-light)] dark:bg-[var(--color-button-primary-dark)] text-[var(--color-button-primary-text-light)] dark:text-[var(--color-button-primary-text-dark)] rounded-lg font-medium hover:bg-[var(--color-button-primary-hover-light)] dark:hover:bg-[var(--color-button-primary-hover-dark)] transition-colors"
            >
              Explore Our Blog
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;