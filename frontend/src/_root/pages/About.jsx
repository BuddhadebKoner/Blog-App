import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Users, MessageSquare, BookOpen, Github, LinkedinIcon } from 'lucide-react';
import { Helmet } from 'react-helmet';

const About = () => {
  const navigate = useNavigate();

  // Example team data
  const teamMembers = [
    {
      id: 1,
      name: "Buddhadeb Koner",
      role: "Full Stack Developer",
      bio: "Buddhadeb has over 3 years of experience in digital content creation and curation.",
      imageUrl: "https://res.cloudinary.com/dsfztnp9x/image/upload/v1740932921/mern-blog/fawqn5nri6ekrslfpe52.jpg"
    },
  ];

  // Stats data
  const stats = [
    { id: 1, label: "Articles Published", value: "0+", icon: BookOpen },
    { id: 2, label: "Community Members", value: "0+", icon: Users },
    { id: 3, label: "Reader Comments", value: "0+", icon: MessageSquare }
  ];

  return (
    <>
      <Helmet>
        <title>About - Blog</title>
      </Helmet>
      <div className="w-full h-fit overflow-auto">
        {/* Hero Section */}
        <section className="w-full px-3 sm:px-4 py-10 sm:py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              About Our Blog
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 px-2 sm:px-4">
              We're passionate about sharing knowledge, fostering meaningful discussions, and building a community of engaged readers and writers.
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="w-full px-3 sm:px-4 py-8 sm:py-12 bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center">
              Our Story
            </h2>
            <div className="space-y-4 sm:space-y-6 text-gray-600 dark:text-gray-400 px-2 sm:px-4">
              <p className="text-sm sm:text-base">
                Founded in 2020, our blog began as a small personal project to share insights on technology and digital culture. What started as a hobby quickly evolved into something much bigger as readers from around the world connected with our content.
              </p>
              <p className="text-sm sm:text-base">
                Today, we're proud to host a diverse range of voices and perspectives. Our platform has grown into a community where experts and enthusiasts alike can share their knowledge, experiences, and ideas.
              </p>
              <p className="text-sm sm:text-base">
                We believe in the power of well-crafted content to inform, inspire, and create meaningful connections. Every article published on our platform is carefully curated to ensure it provides value to our readers.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="w-full px-3 sm:px-4 py-10 sm:py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center">
              Our Values
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
              <div className="p-4 sm:p-6 rounded-lg border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  Quality Over Quantity
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  We prioritize well-researched, thoughtful content that provides genuine value to our readers rather than chasing trends or clicks.
                </p>
              </div>

              <div className="p-4 sm:p-6 rounded-lg border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  Inclusive Community
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  We strive to create a welcoming space where diverse voices and perspectives are valued and respected.
                </p>
              </div>

              <div className="p-4 sm:p-6 rounded-lg border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  Continuous Learning
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  We believe in the importance of lifelong learning and aim to foster curiosity and intellectual growth.
                </p>
              </div>

              <div className="p-4 sm:p-6 rounded-lg border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  Transparency & Authenticity
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  We're committed to being honest and authentic in our content, building trust with our audience through transparency.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full px-3 sm:px-4 py-10 sm:py-16 bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)]">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8 sm:mb-12 text-center">
              Our Impact
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.id} className="flex flex-col items-center text-center">
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4 text-[var(--color-button-primary-light)] dark:text-[var(--color-button-primary-dark)]" />
                    <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">{stat.value}</p>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="w-full px-3 sm:px-4 py-10 sm:py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8 sm:mb-12 text-center">
              Founder
            </h2>
            <div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 flex flex-col space-y-6 sm:space-y-8 mx-auto">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex flex-col items-center text-center p-4 sm:p-6 rounded-lg border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 sm:mb-4">
                    <img
                      src={member?.imageUrl}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                  <p className="text-sm sm:text-base text-[var(--color-button-primary-light)] dark:text-[var(--color-button-primary-dark)] mb-2 sm:mb-3">{member.role}</p>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="w-full px-3 sm:px-4 py-10 sm:py-16 bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] rounded-lg mb-10 sm:mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Get in Touch
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 px-2 sm:px-0">
              Have questions, feedback, or just want to say hello? We'd love to hear from you!
            </p>
            <div className="flex justify-center space-x-5 sm:space-x-6 mb-6 sm:mb-8">
              <a href="mailto:iambuddhadebkoner@gmail.com" className="text-[var(--color-button-primary-light)] dark:text-[var(--color-button-primary-dark)] hover:opacity-80 transition-opacity">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a href="https://github.com/BuddhadebKoner" target="_blank" rel="noopener noreferrer" className="text-[var(--color-button-primary-light)] dark:text-[var(--color-button-primary-dark)] hover:opacity-80 transition-opacity">
                <Github className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a href="https://www.linkedin.com/in/buddhadeb-koner/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-button-primary-light)] dark:text-[var(--color-button-primary-dark)] hover:opacity-80 transition-opacity">
                <LinkedinIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
            </div>
            <button
              onClick={() => navigate('/blogs')}
              className="px-5 py-2.5 sm:px-6 sm:py-3 bg-[var(--color-button-primary-light)] dark:bg-[var(--color-button-primary-dark)] text-[var(--color-button-primary-text-light)] dark:text-[var(--color-button-primary-text-dark)] rounded-lg text-sm sm:text-base font-medium hover:bg-[var(--color-button-primary-hover-light)] dark:hover:bg-[var(--color-button-primary-hover-dark)] transition-colors"
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